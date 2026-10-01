import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Target,
  Clock,
  BookOpen,
  AlertTriangle,
  Calendar,
  BarChart3,
  Play,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  Bot,
  Crown,
  X,
  Info,
} from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const HomeView: React.FC = () => {
  const { profile, updateProfile, setCurrentView, startPractice, setIsTutorDrawerOpen, setActiveMockResult, triggerConfettiCelebration } = useApp();

  const [paymentToast, setPaymentToast] = useState<{ type: 'success' | 'canceled'; message: string } | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isSuccess = searchParams.get('success') === 'true' || searchParams.get('payment_success') === 'true';
    const isCanceled = searchParams.get('canceled') === 'true' || searchParams.get('payment_canceled') === 'true';

    if (isSuccess) {
      // Disparar animación de confeti 🎉
      triggerConfettiCelebration();
      setPaymentToast({
        type: 'success',
        message: '¡Pago exitoso! Bienvenido a ICFES Master Premium. 🚀 Tu acceso ilimitado ha sido desbloqueado.',
      });

      // Actualizar estado del perfil
      updateProfile({
        subscriptionPlan: 'premium',
      });

      // Limpiar la URL para que no vuelva a salir al recargar
      window.history.replaceState(null, '', window.location.pathname);
    } else if (isCanceled) {
      setPaymentToast({
        type: 'canceled',
        message: 'El pago fue cancelado. Puedes intentarlo de nuevo cuando estés listo en la sección de planes.',
      });

      // Limpiar la URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  if (!profile) return null;

  const pendingErrorsCount = profile.mistakes.filter((m) => m.status === 'pending').length;
  const dailyProgressPercent = Math.min(
    100,
    Math.round((profile.questionsAnsweredToday / profile.dailyGoalQuestions) * 100)
  );

  const overallProgressPercent = Math.min(
    100,
    Math.round((profile.totalCorrectAnswers / Math.max(1, profile.totalQuestionsAnswered)) * 100)
  );

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Toast Notificación de Estado de Pago */}
      {paymentToast && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top duration-300 ${
            paymentToast.type === 'success'
              ? 'bg-emerald-950/90 border border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/90 border border-amber-500/40 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {paymentToast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <p className="text-sm font-semibold">{paymentToast.message}</p>
          </div>
          <button
            onClick={() => setPaymentToast(null)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Welcome Greeting & Status Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                <span>¡Hola, {profile.name}!</span>
                <span>👋</span>
              </h1>
              <p className="text-sm sm:text-base text-indigo-200 font-medium mt-0.5">
                ¿Listo para estudiar hoy? Meta Saber 11°: <strong className="text-amber-300 font-bold">{profile.metaPuntaje} puntos</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2 text-xs font-bold text-amber-300">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>Racha: {profile.streakDays} días</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar: Tu Progreso & Meta de Hoy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Overall Progress */}
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-200 font-medium">Tu progreso global</span>
                <span className="font-mono font-bold text-white">{overallProgressPercent}% de precisión</span>
              </div>
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgressPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-indigo-300 flex items-center justify-between">
                <span>{profile.totalQuestionsAnswered} preguntas resueltas</span>
                <span>Nivel {profile.level} ({profile.xp} XP)</span>
              </div>
            </div>

            {/* Daily Goal */}
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-200 font-medium">Meta de hoy</span>
                <span className="font-mono font-bold text-white">
                  {profile.questionsAnsweredToday} de {profile.dailyGoalQuestions} preguntas
                </span>
              </div>
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${dailyProgressPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-amber-200 flex items-center justify-between">
                <span>{dailyProgressPercent >= 100 ? '¡Meta del día completada! 🎉' : `Faltan ${Math.max(0, profile.dailyGoalQuestions - profile.questionsAnsweredToday)} preguntas`}</span>
                <span>{profile.tiempoDiarioMinutos} min diarios</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Callout Banner (if not completed yet) */}
      {!profile.diagnosticoCompletado ? (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full w-max mx-auto sm:mx-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Paso Inicial Recomendado</span>
            </div>
            <h3 className="text-lg font-black tracking-tight">
              Descubre tu nivel actual con la Prueba Diagnóstica
            </h3>
            <p className="text-xs text-white/90 max-w-xl">
              Evalúa tus fortalezas y debilidades en las 5 áreas oficiales del Saber 11° y genera de inmediato tu plan personalizado de estudio.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('diagnostic')}
            className="shrink-0 px-5 py-3 rounded-2xl bg-white text-orange-900 font-extrabold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Iniciar Diagnóstico</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span>Diagnóstico Inicial Completado</span>
                {profile.diagnosticResult && (
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-md font-black">
                    {profile.diagnosticResult.globalScoreScaled} / 500
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                Plan de estudio calibrado según tus fortalezas y debilidades
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {profile.diagnosticResult && (
              <button
                onClick={() => {
                  setActiveMockResult(profile.diagnosticResult!);
                  setCurrentView('mock_result');
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Ver Análisis
              </button>
            )}
            <button
              onClick={() => setCurrentView('diagnostic')}
              className="px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors cursor-pointer"
            >
              Repetir Diagnóstico
            </button>
          </div>
        </div>
      )}

      {/* Upgrade to Premium Banner (if on Free plan) */}
      {profile.subscriptionPlan !== 'premium' && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>Pase Saber 11° Ilimitado</span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight">
              Desbloquea Simulacros y Tutor IA Ilimitado
            </h3>
            <p className="text-xs text-white/90 max-w-xl">
              Asegura tu admisión con el banco completo de preguntas, retroalimentación socrática y análisis psicométrico.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('pricing')}
            className="shrink-0 px-5 py-2.5 rounded-2xl bg-white text-orange-950 font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Ver Planes & Precios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Próxima Actividad Card (Con botón COMENZAR) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tu próxima actividad recomendada
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Matemáticas
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
              Práctica de Razonamiento Cuantitativo y Porcentajes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              5 preguntas tipo Saber 11° seleccionadas para reforzar cálculo de variaciones, regla de 3 y lectura de tablas.
            </p>
          </div>

          <button
            onClick={() =>
              startPractice({
                type: 'rapida',
                area: 'MATEMATICAS',
                topic: 'Razonamiento Cuantitativo',
              })
            }
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>COMENZAR</span>
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Módulos de Estudio y Entrenamiento
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {/* Continuar estudiando / Práctica */}
          <button
            onClick={() => setCurrentView('practice_select')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all text-left space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Modo Práctica
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Rápida, normal, por área o inteligente
              </p>
            </div>
          </button>

          {/* Practicar errores */}
          <button
            onClick={() => setCurrentView('mistakes')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-md transition-all text-left space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform relative">
              <AlertTriangle className="w-5 h-5" />
              {pendingErrorsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingErrorsCount}
                </span>
              )}
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>Practicar Errores</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {pendingErrorsCount > 0
                  ? `${pendingErrorsCount} conceptos por reforzar`
                  : 'Sin errores pendientes'}
              </p>
            </div>
          </button>

          {/* Simulacro Completo */}
          <button
            onClick={() => setCurrentView('mock_select')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all text-left space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Simulacro Saber 11°
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Experiencia de examen real cronometrada
              </p>
            </div>
          </button>

          {/* Aprende (Contenido temático) */}
          <button
            onClick={() => setCurrentView('learn')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all text-left space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Sección Aprende
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Teoría, fórmulas, ejemplos y tips
              </p>
            </div>
          </button>

          {/* Mi Progreso */}
          <button
            onClick={() => setCurrentView('progress')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all text-left space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Mi Progreso
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Rendimiento por área y competencias
              </p>
            </div>
          </button>

          {/* Plan de Estudio */}
          <button
            onClick={() => setCurrentView('study_plan')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all text-left space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Plan de Estudio
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Calendario semanal personalizado
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Tutor ICFES CTA Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-black text-base">¿Tienes dudas en algún tema?</h4>
            <p className="text-xs text-emerald-100">
              Consulta al <strong>Tutor ICFES</strong>: te explica el razonamiento paso a paso o en modo principiante.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsTutorDrawerOpen(true)}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-extrabold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all"
        >
          Consultar Tutor
        </button>
      </div>

      {/* Mandatory ICFES Disclaimer */}
      <DisclaimerNotice />
    </div>
  );
};
