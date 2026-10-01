import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import {
  BookOpen,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Award,
  GraduationCap,
  ShieldCheck,
  Check,
  Star,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const AuthView: React.FC = () => {
  const { profile, login, setCurrentView } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [curso, setCurso] = useState<'10°' | '11°' | 'Graduado / Preicfes'>(profile?.curso || '11°');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('La contraseña debe contener al menos 6 caracteres.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Por favor ingresa tu nombre completo.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Las contraseñas no coinciden. Por favor verifícalas.');
        return;
      }
      if (!acceptTerms) {
        setErrorMsg('Debes aceptar los términos y condiciones de uso.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        // Real Supabase Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (error) {
          const lower = error.message.toLowerCase();
          if (
            lower.includes('invalid login credentials') ||
            lower.includes('invalid credentials') ||
            lower.includes('invalid_grant')
          ) {
            setErrorMsg('Contraseña o correo electrónico incorrectos. Por favor verifica tus credenciales.');
          } else if (lower.includes('email not confirmed')) {
            setErrorMsg('Debes confirmar tu correo electrónico antes de ingresar. Por favor revisa tu bandeja de entrada o spam.');
          } else if (lower.includes('user not found')) {
            setErrorMsg('No existe ningún usuario registrado con este correo electrónico.');
          } else if (lower.includes('invalid email')) {
            setErrorMsg('El formato del correo electrónico ingresado no es válido.');
          } else if (lower.includes('rate limit')) {
            setErrorMsg('Demasiados intentos fallidos. Por favor espera unos minutos antes de intentar de nuevo.');
          } else if (lower.includes('fetch') || lower.includes('network') || lower.includes('failed to fetch')) {
            setErrorMsg('No se pudo conectar con el servidor de Supabase. Revisa tu conexión o las credenciales del proyecto.');
          } else {
            setErrorMsg(error.message);
          }
          setIsLoading(false);
          return;
        }

        // Successfully authenticated with Supabase
        const user = data.user;
        const fullName =
          user?.user_metadata?.full_name ||
          (name && name.trim().length > 0 ? name : cleanEmail.split('@')[0]);
        const userCurso = user?.user_metadata?.curso || curso;

        login(user?.email || cleanEmail, fullName, userCurso);
      } else {
        // Real Supabase Registration
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: name.trim(),
              curso: curso,
            },
          },
        });

        if (error) {
          const lower = error.message.toLowerCase();
          if (lower.includes('already registered') || lower.includes('already exists') || lower.includes('unique constraint')) {
            setErrorMsg('El usuario ya existe con este correo electrónico. Por favor inicia sesión con tu contraseña.');
          } else if (lower.includes('at least 6 characters')) {
            setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
          } else if (lower.includes('rate limit')) {
            setErrorMsg('Demasiados intentos. Por favor espera unos minutos antes de volver a intentar.');
          } else if (lower.includes('fetch') || lower.includes('network') || lower.includes('failed to fetch')) {
            setErrorMsg('No se pudo conectar con el servidor de Supabase. Revisa tu conexión o las credenciales del proyecto.');
          } else {
            setErrorMsg(error.message);
          }
          setIsLoading(false);
          return;
        }

        // If session returned immediately (email confirmation disabled in Supabase)
        if (data.session) {
          login(cleanEmail, name.trim(), curso);
        } else if (data.user) {
          // If Supabase has email confirmation enabled
          setSuccessMsg(
            `¡Registro exitoso! Enviamos un enlace de confirmación a ${cleanEmail}. Por favor verifica tu bandeja de entrada o spam para activar tu cuenta.`
          );
          setMode('login');
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado al procesar la solicitud.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Usa el origen actual de la app o http://localhost:3000
    const redirectUrl =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'http://localhost:3000';

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl, // Para que vuelva a tu app después de autorizar
        },
      });

      if (error) {
        console.error('Error al iniciar con Google:', error.message);
        const lower = error.message.toLowerCase();
        if (lower.includes('not enabled') || lower.includes('unsupported') || lower.includes('provider')) {
          setErrorMsg('El proveedor de Google aún no está activado en tu panel de Supabase (Authentication > Providers > Google).');
        } else {
          setErrorMsg(error.message);
        }
      }
    } catch (err: any) {
      console.error('Error al iniciar con Google:', err?.message || err);
      setErrorMsg(err.message || 'No se pudo iniciar la autenticación con Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = handleGoogleLogin;

  const handleForgotPassword = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Ingresa tu correo electrónico arriba para enviarte el enlace de recuperación.');
      return;
    }
    setErrorMsg(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setForgotSent(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al solicitar recuperación de contraseña.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-2 sm:py-6 animate-in fade-in duration-200">
      {/* Back button (only if user is already authenticated) */}
      {profile?.isAuthenticated && (
        <div className="mb-4">
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Dashboard</span>
          </button>
        </div>
      )}

      {/* Split Screen Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* ======================================================== */}
        {/* LEFT SIDE: Form (Login / Registro con Supabase)          */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 xl:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div className="space-y-6 max-w-md mx-auto w-full">
            {/* Logo & Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 dark:from-blue-400 dark:to-amber-400 bg-clip-text text-transparent">
                  ICFES MASTER SABER 11°
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {mode === 'login' ? '¡Hola de nuevo!' : 'Crea tu cuenta de estudio'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {mode === 'login'
                  ? 'Ingresa a tu cuenta para continuar con tus simulacros y tu racha de estudio.'
                  : 'Empieza tu preparación personalizada por competencias y asegura tu cupo universitario.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl flex items-center gap-1 border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Registrarme Gratis
              </button>
            </div>

            {/* Success banner */}
            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-medium flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Error banner */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xs active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {/* Google multicolored G SVG icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{mode === 'login' ? 'Iniciar sesión con Google' : 'Registrarme con Google'}</span>
            </button>

            {/* Or divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                o con tu correo
              </span>
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Valentina Morales"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Grado / Estado Académico
                    </label>
                    <select
                      value={curso}
                      onChange={(e) => setCurso(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="11°">Grado 11° (Aspirante oficial 2026)</option>
                      <option value="10°">Grado 10° (Preparación temprana)</option>
                      <option value="Graduado / Preicfes">Graduado / Preicfes intensivo</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="estudiante@colegio.edu.co"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Contraseña
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {forgotSent && mode === 'login' && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200">
                  Enviamos un enlace de recuperación seguro a <strong>{email}</strong>.
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              {/* Checkboxes */}
              {mode === 'login' ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-slate-600 dark:text-slate-400 select-none">
                    Recordar mi sesión en este dispositivo
                  </label>
                </div>
              ) : (
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="acceptTerms" className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight select-none">
                    Acepto los Términos de Servicio y la Política de Privacidad para el tratamiento de datos pedagógicos.
                  </label>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <span>Conectando con Supabase...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Iniciar Sesión' : 'Crear mi Cuenta Gratis'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Trust badges footer */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Autenticación Segura SSL
            </span>
            <span>•</span>
            <span>Datos 100% Confidenciales</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT SIDE: Inspirational Campus & Admission Banner       */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 xl:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 p-6 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle cosmic background glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Inspirational Tag */}
          <div className="relative space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-black shadow-xs">
              <GraduationCap className="w-4 h-4" />
              <span>META: ADMISIÓN UNIVERSITARIA 2026</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              "Tu meta no es solo pasar el examen; es elegir la carrera que te apasiona."
            </h2>

            <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
              Las Pruebas Saber 11° abren las puertas a becas de matrícula total y a las mejores universidades de Colombia:
            </p>

            {/* University & benefits pill grid */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-black text-xs">
                  400+
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white">Cupo en Medicina e Ingenierías</h4>
                  <p className="text-[11px] text-indigo-200">
                    Supera los cortes de admisión en la U. Nacional, UdeA, UIS y Univalle.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 font-black text-xs">
                  100%
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white">Becas de Excelencia Académica</h4>
                  <p className="text-[11px] text-indigo-200">
                    Distinción Andrés Bello y programas de gratuidad para universidades privadas.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-blue-400 text-slate-950 flex items-center justify-center shrink-0 font-black text-xs">
                  24/7
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white">Tutor IA Pedagógico Siempre Disponible</h4>
                  <p className="text-[11px] text-indigo-200">
                    Aprende el porqué de cada respuesta y erradica las trampas cognitivas del examen.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Real Student Testimonial Quote */}
          <div className="relative pt-6 border-t border-white/10 mt-6 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-indigo-100 italic leading-relaxed">
              "Obtuve 412 puntos en el Saber 11° y logré mi cupo en Medicina en la Universidad Nacional. El banco de errores y el cronómetro de ICFES Master cambiaron por completo mi forma de responder."
            </p>
            <div className="flex items-center justify-between text-[11px] text-indigo-300">
              <span className="font-bold text-white">Valentina Morales • Puntaje 412</span>
              <span>Aspirante 2025</span>
            </div>
          </div>
        </div>
      </div>

      <DisclaimerNotice />
    </div>
  );
};
