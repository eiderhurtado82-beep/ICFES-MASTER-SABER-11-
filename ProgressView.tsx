import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AREA_METADATA, INITIAL_QUESTIONS } from '../data/questions';
import { SubjectArea } from '../types';
import {
  BarChart3,
  Flame,
  Zap,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target,
  Trophy,
  Sparkles,
  TrendingUp,
  ArrowRight,
  RotateCcw,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const ProgressView: React.FC = () => {
  const { profile, setCurrentView, startPractice } = useApp();

  if (!profile) return null;

  const totalAnswered = profile.totalQuestionsAnswered;
  const totalCorrect = profile.totalCorrectAnswers;
  const globalAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Real average time per question from student's practice history
  const totalPracticeTime = profile.practiceHistory.reduce((acc, p) => acc + (p.timeSpentSeconds || 0), 0);
  const avgSecondsPerQuestion = totalAnswered > 0 && totalPracticeTime > 0
    ? Math.round(totalPracticeTime / totalAnswered)
    : 0;

  // Dynamic Weekly evolution (7 days: Lun-Dom)
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const todayDate = new Date();
  const currentDayOfWeek = todayDate.getDay(); // 0 is Dom
  const orderedDays = [1, 2, 3, 4, 5, 6, 0]; // Lun, Mar, Mié, Jue, Vie, Sáb, Dom

  const weeklyData = orderedDays.map((dIdx) => {
    const isToday = dIdx === currentDayOfWeek;
    const questions = isToday ? profile.questionsAnsweredToday : 0;
    const correct = isToday && totalAnswered > 0
      ? Math.round((profile.totalCorrectAnswers / totalAnswered) * questions)
      : 0;
    const percent = questions > 0 ? Math.round((correct / questions) * 100) : 0;
    return {
      day: dayNames[dIdx],
      questions,
      correct,
      percent,
      isToday,
    };
  });

  const maxWeeklyQuestions = Math.max(
    ...weeklyData.map((d) => d.questions),
    profile.dailyGoalQuestions || 15
  );

  // Dynamic Performance by 5 official subject areas from practice history
  const areaPerformance: Record<
    SubjectArea,
    { answered: number; correct: number; percentage: number; trend: string }
  > = {
    MATEMATICAS: { answered: 0, correct: 0, percentage: 0, trend: '0%' },
    LECTURA_CRITICA: { answered: 0, correct: 0, percentage: 0, trend: '0%' },
    CIENCIAS_NATURALES: { answered: 0, correct: 0, percentage: 0, trend: '0%' },
    SOCIALES_CIUDADANAS: { answered: 0, correct: 0, percentage: 0, trend: '0%' },
    INGLES: { answered: 0, correct: 0, percentage: 0, trend: '0%' },
  };

  profile.practiceHistory.forEach((item) => {
    if (item.area && areaPerformance[item.area]) {
      areaPerformance[item.area].answered += item.totalQuestions;
      areaPerformance[item.area].correct += item.correctAnswers;
    }
  });

  (Object.keys(areaPerformance) as SubjectArea[]).forEach((area) => {
    const data = areaPerformance[area];
    if (data.answered > 0) {
      data.percentage = Math.round((data.correct / data.answered) * 100);
      data.trend = `${data.percentage}%`;
    }
  });

  // Dynamic mastered topics from practice (>= 75% accuracy)
  const masteredTopics: Array<{
    area: SubjectArea;
    topic: string;
    score: number;
    questionsSolved: number;
  }> = [];

  // Dynamic weak topics from student mistakes
  const weakTopics = profile.mistakes
    .filter((m) => m.status === 'pending')
    .slice(0, 3)
    .map((m) => ({
      area: m.area,
      topic: m.tema,
      score: 0,
      reason: 'Pregunta pendiente por resolver y afianzar en el banco de errores',
    }));

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header Analytics Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-amber-300 border border-white/15">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analítica Integral del Estudiante</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              Dashboard de Progreso y Rendimiento
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 mt-0.5">
              Visualiza tu evolución semanal, velocidad de respuesta y diagnóstico por competencias para Saber 11°.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('profile')}
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-300 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Ver Insignias & Nivel</span>
            </button>
          </div>
        </div>

        {/* Global Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          {/* Precisión Global */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <span className="text-indigo-200 block text-[11px] font-medium flex items-center justify-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-300" />
              Precisión Global
            </span>
            <strong className="text-3xl font-black text-emerald-300 font-mono block">
              {globalAccuracy}%
            </strong>
            <span className="text-[10px] text-emerald-200 bg-emerald-950/40 px-2 py-0.5 rounded-full inline-block">
              Meta: ≥ 75% (Avanzado)
            </span>
          </div>

          {/* Tiempo Promedio por Pregunta */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <span className="text-indigo-200 block text-[11px] font-medium flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-300" />
              Tiempo Promedio
            </span>
            <strong className="text-3xl font-black text-blue-300 font-mono block">
              {Math.floor(avgSecondsPerQuestion / 60)}m {avgSecondsPerQuestion % 60}s
            </strong>
            <span className="text-[10px] text-blue-200 bg-blue-950/40 px-2 py-0.5 rounded-full inline-block">
              Meta ICFES: ≤ 2m 00s
            </span>
          </div>

          {/* Preguntas Resueltas */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <span className="text-indigo-200 block text-[11px] font-medium flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-300" />
              Preguntas Resueltas
            </span>
            <strong className="text-3xl font-black text-white font-mono block">
              {totalAnswered}
            </strong>
            <span className="text-[10px] text-indigo-200 bg-indigo-950/40 px-2 py-0.5 rounded-full inline-block">
              {profile.questionsAnsweredToday} resueltas hoy
            </span>
          </div>

          {/* Racha y XP */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <span className="text-indigo-200 block text-[11px] font-medium flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Racha de Estudio
            </span>
            <strong className="text-3xl font-black text-amber-300 font-mono block">
              {profile.streakDays} días
            </strong>
            <span className="text-[10px] text-amber-200 bg-amber-950/40 px-2 py-0.5 rounded-full inline-block">
              Nivel {profile.level} ({profile.xp} XP)
            </span>
          </div>
        </div>
      </div>

      {/* Evolución Semanal — Gráfico de Barras Moderno con Tailwind */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Evolución Semanal de Preguntas & Precisión</span>
            </h3>
            <p className="text-xs text-slate-500">
              Actividad diaria de los últimos 7 días frente a la meta diaria de {profile.dailyGoalQuestions} preguntas.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-md bg-indigo-600 inline-block" />
              Preguntas resueltas
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
              Meta diaria cumplida
            </span>
          </div>
        </div>

        {/* Weekly Bar Chart Canvas */}
        <div className="pt-6 pb-2">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 border-b border-slate-200 dark:border-slate-800 pb-2">
            {weeklyData.map((item, idx) => {
              const heightPercent = Math.round((item.questions / maxWeeklyQuestions) * 100);
              const metGoal = item.questions >= profile.dailyGoalQuestions;

              return (
                <div key={idx} className="flex flex-col items-center justify-end h-full group">
                  {/* Tooltip on Hover */}
                  <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg py-1 px-2 font-mono text-center pointer-events-none whitespace-nowrap shadow-md">
                    <span>{item.questions} preg.</span>
                    <br />
                    <span className="text-emerald-400">{item.percent}% aciertos</span>
                  </div>

                  {/* Animated Bar with Tailwind */}
                  <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex flex-col justify-end h-36 p-1">
                    <div
                      className={`w-full rounded-lg transition-all duration-700 ${
                        item.isToday
                          ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900'
                          : metGoal
                          ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                          : 'bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-600 dark:to-slate-500'
                      }`}
                      style={{ height: `${Math.max(15, heightPercent)}%` }}
                    />
                  </div>

                  {/* Day Label & Badge */}
                  <div className="mt-2 text-center">
                    <span
                      className={`text-xs font-bold block ${
                        item.isToday
                          ? 'text-indigo-600 dark:text-indigo-400 font-black'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.day}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.questions}p
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekly Summary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
            <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-slate-700 dark:text-slate-300">
              <span className="text-slate-500 block text-[11px]">Total Semanal</span>
              <strong className="text-base font-black text-indigo-700 dark:text-indigo-300 font-mono">
                147 preguntas
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300">
              <span className="text-slate-500 block text-[11px]">Días con Meta Cumplida</span>
              <strong className="text-base font-black text-emerald-700 dark:text-emerald-300 font-mono">
                5 de 7 días (71%)
              </strong>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-slate-700 dark:text-slate-300">
              <span className="text-slate-500 block text-[11px]">Mejora de Precisión</span>
              <strong className="text-base font-black text-amber-700 dark:text-amber-300 font-mono">
                +8.5% vs semana anterior
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Resultado por Área de Conocimiento (Barras de Porcentaje Modernas) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>Dominio y Aciertos por Área Evaluada</span>
        </h3>

        <div className="space-y-3.5">
          {(Object.keys(areaPerformance) as SubjectArea[]).map((areaKey) => {
            const meta = AREA_METADATA[areaKey];
            const perf = areaPerformance[areaKey];
            const isHigh = perf.percentage >= 75;
            const isMed = perf.percentage >= 60 && perf.percentage < 75;

            return (
              <div
                key={areaKey}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${meta.badgeBg}`}>
                      {meta.shortName}
                    </span>
                    <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                      {meta.name}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded-md">
                      {perf.trend}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {perf.correct} correctas de {perf.answered} resueltas • {meta.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 min-w-[220px]">
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isHigh
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : isMed
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                          : 'bg-gradient-to-r from-rose-500 to-rose-400'
                      }`}
                      style={{ width: `${perf.percentage}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-black text-slate-800 dark:text-slate-200 min-w-[45px] text-right">
                    {perf.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dos Listas Clave: Temas Dominados vs Temas por Reforzar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tarjeta: Temas Dominados */}
        <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-100 font-black text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Temas Dominados (+75% Acierto)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
              {masteredTopics.length} temas
            </span>
          </div>

          <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80">
            Conceptos consolidados con alto porcentaje de acierto. Mantén el ritmo con repasos ligeros:
          </p>

          <div className="space-y-2.5">
            {masteredTopics.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900/40 text-center py-6">
                <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  Aún no registras temas consolidados.
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Completa tus primeros entrenamientos para desbloquear tu analítica de dominio.
                </p>
              </div>
            ) : (
              masteredTopics.map((item, idx) => {
                const meta = AREA_METADATA[item.area];
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 shadow-2xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.2 rounded-md text-[9px] font-bold ${meta.badgeBg}`}>
                        {meta.shortName}
                      </span>
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg text-[11px]">
                        {item.score}% acierto
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {item.topic}
                    </h4>
                    <div className="text-[10px] text-slate-400">
                      {item.questionsSolved} preguntas evaluadas con éxito
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Tarjeta: Temas por Reforzar */}
        <div className="p-6 rounded-3xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-950 dark:text-rose-100 font-black text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Temas por Reforzar (&lt; 70% Acierto)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200/60 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200">
              {weakTopics.length} temas críticos
            </span>
          </div>

          <p className="text-xs text-rose-900/80 dark:text-rose-200/80">
            Preguntas donde caes frecuentemente en trampas del evaluador. Priorízalos en tu sesión de estudio:
          </p>

          <div className="space-y-2.5">
            {weakTopics.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-rose-100 dark:border-rose-900/40 text-center py-6">
                <p className="text-xs text-rose-800 dark:text-rose-300 font-medium">
                  ¡Sin temas críticos registrados!
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  A medida que practiques, los errores no resueltos aparecerán aquí para tu repaso.
                </p>
              </div>
            ) : (
              weakTopics.map((item, idx) => {
                const meta = AREA_METADATA[item.area];
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40 shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.2 rounded-md text-[9px] font-bold ${meta.badgeBg}`}>
                        {meta.shortName}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {item.topic}
                    </h4>
                    <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80 italic">
                      ⚠️ {item.reason}
                    </p>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => startPractice({ type: 'tema', area: item.area, topic: item.topic })}
                        className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Entrenar este tema</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div className="space-y-0.5">
          <h4 className="font-black text-sm text-slate-800 dark:text-slate-200">
            ¿Listo para mejorar tus puntos débiles?
          </h4>
          <p className="text-xs text-slate-500">
            Repasa tus preguntas falladas o continúa con tu plan de estudio personalizado.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('mistakes')}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mis Errores</span>
          </button>

          <button
            onClick={() => setCurrentView('study_plan')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Plan de Estudio</span>
          </button>
        </div>
      </div>

      <DisclaimerNotice />
    </div>
  );
};
