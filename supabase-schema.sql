-- ==============================================================================
-- ICFES Saber 11 Platform - Esquema de Base de Datos Supabase
-- Tablas: profiles (Gamificación) y practice_sessions (Simulacros y Progreso)
-- ==============================================================================

-- ==============================================================================
-- 1. TABLA: profiles (Gamificación, Niveles, XP y Rachas)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar seguridad a nivel de fila (RLS) en profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad para profiles
DROP POLICY IF EXISTS "Usuarios pueden leer su propio perfil" ON profiles;
CREATE POLICY "Usuarios pueden leer su propio perfil" 
ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON profiles;
CREATE POLICY "Usuarios pueden actualizar su propio perfil" 
ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuarios pueden insertar su propio perfil" ON profiles;
CREATE POLICY "Usuarios pueden insertar su propio perfil" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger: Crear un perfil automáticamente cuando alguien se registra
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, xp, level, streak_days)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), -- Toma el nombre de Google Auth o Email
    0, 
    1, 
    0
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==============================================================================
-- 2. TABLA: practice_sessions (Simulacros y Sesiones de Práctica)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  answers JSONB DEFAULT '{}'::jsonb,
  time_elapsed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar seguridad a nivel de fila (RLS) en practice_sessions
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad para practice_sessions
DROP POLICY IF EXISTS "Estudiantes pueden ver sus propias sesiones" ON practice_sessions;
CREATE POLICY "Estudiantes pueden ver sus propias sesiones"
ON practice_sessions FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Estudiantes pueden insertar sus propias sesiones" ON practice_sessions;
CREATE POLICY "Estudiantes pueden insertar sus propias sesiones"
ON practice_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Estudiantes pueden actualizar sus propias sesiones" ON practice_sessions;
CREATE POLICY "Estudiantes pueden actualizar sus propias sesiones"
ON practice_sessions FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Estudiantes pueden eliminar sus propias sesiones" ON practice_sessions;
CREATE POLICY "Estudiantes pueden eliminar sus propias sesiones"
ON practice_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para automatizar el campo 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_practice_sessions_updated_at ON practice_sessions;
CREATE TRIGGER update_practice_sessions_updated_at
BEFORE UPDATE ON practice_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 3. FUNCIÓN RPC: increment_profile_xp (Incremento atómico de XP y Nivel)
-- ==============================================================================

CREATE OR REPLACE FUNCTION increment_profile_xp(user_id UUID, xp_to_add INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET 
    xp = COALESCE(xp, 0) + xp_to_add,
    level = GREATEST(1, FLOOR(SQRT((COALESCE(xp, 0) + xp_to_add) / 40.0)) + 1),
    last_study_date = CURRENT_DATE
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 4. TABLA: user_mistakes (Banco de Errores y Repetición Inteligente)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS user_mistakes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL, -- ID de la pregunta fallada
  subject TEXT NOT NULL,
  question_text TEXT, -- Texto de la pregunta
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  ai_explanation TEXT, -- Justificación pedagógica / por qué
  is_resolved BOOLEAN DEFAULT false, -- Cambia a true cuando el usuario domina el tema
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar seguridad a nivel de fila (RLS) en user_mistakes
ALTER TABLE user_mistakes ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad para user_mistakes
DROP POLICY IF EXISTS "Usuarios ven sus propios errores" ON user_mistakes;
CREATE POLICY "Usuarios ven sus propios errores" 
ON user_mistakes FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios insertan sus errores" ON user_mistakes;
CREATE POLICY "Usuarios insertan sus errores" 
ON user_mistakes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios actualizan sus errores (ej. marcar como resuelto)" ON user_mistakes;
CREATE POLICY "Usuarios actualizan sus errores (ej. marcar como resuelto)" 
ON user_mistakes FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios eliminan sus errores" ON user_mistakes;
CREATE POLICY "Usuarios eliminan sus errores" 
ON user_mistakes FOR DELETE 
USING (auth.uid() = user_id);

-- ==============================================================================
-- 5. TABLA: subscriptions (Gestión de Suscripciones y Stripe)
-- ==============================================================================

-- 1. Crear tabla de suscripciones
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'free')),
  plan_type TEXT DEFAULT 'free', -- 'free', 'premium_monthly', 'premium_annual'
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. Políticas: El usuario solo puede leer su propia suscripción
DROP POLICY IF EXISTS "Usuarios pueden ver su propia suscripción" ON subscriptions;
CREATE POLICY "Usuarios pueden ver su propia suscripción" 
ON subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Trigger: Asignar plan gratuito automático al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_subscription() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, status, plan_type)
  VALUES (new.id, 'free', 'free')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_sub ON auth.users;
CREATE TRIGGER on_auth_user_created_sub
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_subscription();



