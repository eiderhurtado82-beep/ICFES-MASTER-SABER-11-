import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  GraduationCap,
  MapPin,
  Calendar,
  Target,
  Clock,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Shield,
  Award,
  Trophy,
  Flame,
  Zap,
  Lock,
  LogIn,
  LogOut,
  Mail,
} from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, resetAllData, triggerConfettiCelebration, logout, setCurrentView } = useApp();

  const [name, setName] = useState(profile?.name || '');
  const [curso, setCurso] = useState(profile?.curso || '11°');
  const [institucion, setInstitucion] = useState(profile?.institucion || '');
  const [ciudad, setCiudad] = useState(profile?.ciudad || '');
  const [fechaExamen, setFechaExamen] = useState(profile?.fechaExamen || '2026-08-16');
  const [metaPuntaje, setMetaPuntaje] = useState(profile?.metaPuntaje || 380);
  const [tiempoDiarioMinutos, setTiempoDiarioMinutos] = useState(profile?.tiempoDiarioMinutos || 30);
  const [dailyGoalQuestions, setDailyGoalQuestions] = useState(profile?.dailyGoalQuestions || 15);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!profile) return null;

  // Level & XP math
  const currentXP = profile.xp;
  const xpPerLevel = 150;
  const xpInCurrentLevel = currentXP % xpPerLevel;
  const levelPercent = Math.min(100, Math.round((xpInCurrentLevel / xpPerLevel) * 100));
  const xpNeededForNext = xpPerLevel - xpInCurrentLevel;

  // Level Rank Titles
  const getLevelTitle = (lvl: number) => {
    if (lvl === 1) return 'Aspirante Inicial';
    if (lvl === 2) return 'Estudiante Dedicado';
    if (lvl === 3) return 'Estratega Saber 11°';
    if (lvl === 4) return 'Maestro de Competencias';
    return 'Candidato a Beca ICFES';
  };

  const unlockedAchievementsCount = profile.achievements.filter((a) => a.unlocked).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      curso,
      institucion,
      ciudad,
      fechaExamen,
      metaPuntaje,
      tiempoDiarioMinutos,
      dailyGoalQuestions,
    });
    setSavedSuccess(true);
    triggerConfettiCelebration();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Gamification & Level Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-950 text-white shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-3xl font-black text-white shadow-lg ring-4 ring-white/10 shrink-0">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-black border-2 border-indigo-950 shadow-xs">
                Nv.{profile.level}
              </div>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black">{profile.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-xs font-bold text-amber-300">
                  {getLevelTitle(profile.level)}
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                {profile.institucion ? `${profile.institucion} • ` : ''}
                {profile.ciudad || 'Colombia'} (Grado {profile.curso})
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  Racha: {profile.streakDays} días
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-300 bg-blue-400/20 px-2 py-0.5 rounded-md">
                  <Zap className="w-3.5 h-3.5 fill-blue-300" />
                  {profile.xp} XP acumulados
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center gap-2 text-right">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[130px]">
              <span className="text-[10px] text-indigo-200 block font-medium">Meta Saber 11°</span>
              <strong className="text-2xl font-black text-amber-300 font-mono">
                {profile.metaPuntaje}
                <span className="text-xs text-indigo-200 font-normal"> / 500</span>
              </strong>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar with Tailwind */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-indigo-200">
            <span className="font-bold flex items-center gap-1.5 text-white">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              Nivel {profile.level}: {getLevelTitle(profile.level)}
            </span>
            <span className="font-mono text-xs text-amber-300 font-bold">
              {xpInCurrentLevel} / {xpPerLevel} XP ({levelPercent}%)
            </span>
          </div>

          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${levelPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-indigo-300">
            <span>Faltan {xpNeededForNext} XP para subir a Nivel {profile.level + 1}</span>
            <span>+15 XP por cada respuesta correcta</span>
          </div>
        </div>
      </div>

      {/* Account Authentication & Sync Status Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <User className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Cuenta Supabase Conectada
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Sincronización en la Nube Activa
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.email || 'Sesión Segura Activa'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Cuadrícula de Insignias y Logros (Gamificación) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Insignias y Logros de Preparación</span>
            </h3>
            <p className="text-xs text-slate-500">
              Desbloquea insignias cumpliendo metas de estudio, rachas y simulacros cronometrados.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {unlockedAchievementsCount} de {profile.achievements.length} Desbloqueados
          </span>
        </div>

        {/* Badges Grid: Showing unlocked and locked states */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1">
          {profile.achievements.map((ach) => {
            const isUnlocked = ach.unlocked;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-50/80 to-amber-100/40 dark:from-amber-950/30 dark:to-slate-900 border-amber-300 dark:border-amber-800 shadow-xs'
                    : 'bg-slate-50/80 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-2xs border ${
                      isUnlocked
                        ? 'bg-white dark:bg-slate-800 border-amber-200 dark:border-amber-700'
                        : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 grayscale'
                    }`}
                  >
                    {ach.icon}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                        {ach.title}
                      </h4>
                      {isUnlocked ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                          Logrado ✨
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          <Lock className="w-2.5 h-2.5" />
                          Bloqueado
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {ach.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar for locked achievements with measurable goal */}
                {!isUnlocked && ach.maxProgress && (
                  <div className="space-y-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Progreso:</span>
                      <span className="font-mono font-bold">
                        {ach.progress || 0} / {ach.maxProgress}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(((ach.progress || 0) / ach.maxProgress) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {isUnlocked && (
                  <div className="text-[10px] text-amber-700 dark:text-amber-300 font-medium pt-1 border-t border-amber-200/60 dark:border-amber-900/60 flex items-center justify-between">
                    <span>Insignia activa en tu perfil</span>
                    <span>✓ Verificada</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Formulario de Configuración del Estudiante */}
      <form
        onSubmit={handleSave}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <span>Configuración y Preferencias de Estudio</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            Ajusta tu meta y tiempo disponible
          </span>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>¡Tu perfil y plan de estudio han sido actualizados con éxito!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Nombre */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Nombre o Apodo:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>

          {/* Curso */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Curso / Nivel Académico:
            </label>
            <select
              value={curso}
              onChange={(e) => setCurso(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium cursor-pointer"
            >
              <option value="10°">Grado 10°</option>
              <option value="11°">Grado 11° (Último año escolar)</option>
              <option value="Graduado / Preicfes">Graduado / Curso Preicfes</option>
            </select>
          </div>

          {/* Institución Educativa */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Institución Educativa (Colegio):
            </label>
            <input
              type="text"
              value={institucion}
              onChange={(e) => setInstitucion(e.target.value)}
              placeholder="Colegio / Liceo"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>

          {/* Ciudad */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Ciudad / Municipio:
            </label>
            <input
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              placeholder="Ej. Bogotá, Medellín, Cali, Barranquilla"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>

          {/* Fecha del Examen */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Fecha Prevista del Examen Saber 11°:
            </label>
            <input
              type="date"
              required
              value={fechaExamen}
              onChange={(e) => setFechaExamen(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
            />
          </div>

          {/* Meta Personal de Puntaje */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Meta de Puntaje: <span className="text-indigo-600 dark:text-indigo-400 font-black">{metaPuntaje}</span> / 500
            </label>
            <input
              type="number"
              min="200"
              max="500"
              value={metaPuntaje}
              onChange={(e) => setMetaPuntaje(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
            />
          </div>

          {/* Tiempo Diario Disponible */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Tiempo Diario de Estudio: {tiempoDiarioMinutos} min
            </label>
            <input
              type="number"
              min="15"
              max="240"
              step="15"
              value={tiempoDiarioMinutos}
              onChange={(e) => setTiempoDiarioMinutos(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
            />
          </div>

          {/* Meta Diaria de Preguntas */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Meta Diaria de Preguntas: {dailyGoalQuestions} preguntas
            </label>
            <input
              type="number"
              min="5"
              max="50"
              value={dailyGoalQuestions}
              onChange={(e) => setDailyGoalQuestions(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
            />
          </div>
        </div>

        <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  '¿Estás seguro de que deseas reiniciar todos los datos y restablecer el progreso de prueba?'
                )
              ) {
                resetAllData();
              }
            }}
            className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
          >
            Restablecer Datos Locales
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>

      <DisclaimerNotice />
    </div>
  );
};
