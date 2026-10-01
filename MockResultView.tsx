import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubjectArea } from '../types';
import { AREA_METADATA, INITIAL_QUESTIONS } from '../data/questions';
import { QuestionCard } from '../components/QuestionCard';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Award,
  Compass,
  ArrowRight,
  RotateCcw,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const MockResultView: React.FC = () => {
  const { activeMockResult, setCurrentView, startPractice } = useApp();
  const [showQuestionReview, setShowQuestionReview] = useState(false);

  if (!activeMockResult) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-500">No hay resultados de simulacro activos para mostrar.</p>
        <button
          onClick={() => setCurrentView('mock_select')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer"
        >
          Ir a Simulacros
        </button>
      </div>
    );
  }

  const result = activeMockResult;
  const avgTimePerQuestion = Math.round(result.timeUsedSeconds / result.totalQuestions);

  // Official ICFES Performance tier categorization
  let tierName = 'Satisfactorio';
  let tierBadge = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
  let tierDesc = 'Demuestras dominio adecuado de los conceptos y competencias evaluadas en la prueba.';

  if (result.globalScoreScaled < 250) {
    tierName = 'Insuficiente';
    tierBadge = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
    tierDesc = 'No se evidencia el dominio mínimo requerido. Es prioritario reforzar conceptos elementales.';
  } else if (result.globalScoreScaled < 330) {
    tierName = 'Mínimo';
    tierBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
    tierDesc = 'Demuestras comprensión básica en situaciones sencillas, con dificultades en razonamiento complejo.';
  } else if (result.globalScoreScaled >= 400) {
    tierName = 'Avanzado';
    tierBadge = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
    tierDesc = 'Sobresaliente capacidad de argumentación, inferencia crítica y resolución de problemas interdisciplinares.';
  }

  // Identify strengths (>= 60%) and weaknesses (< 60%)
  const areasList = Object.keys(result.areaBreakdown) as SubjectArea[];
  const strengths = areasList.filter((a) => result.areaBreakdown[a].percentage >= 60);
  const weaknesses = areasList.filter((a) => result.areaBreakdown[a].percentage < 60);

  // Get question objects that were evaluated in the exam
  const answeredQuestionIds = Object.keys(result.userAnswers);
  const evaluatedQuestions = INITIAL_QUESTIONS.filter((q) => answeredQuestionIds.includes(q.id));

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* 360° Hero Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-950 text-white shadow-xl text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-bold text-amber-300 border border-white/15">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Informe 360° de Simulacro Saber 11°</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black">
          Tu Diagnóstico de Rendimiento
        </h2>

        {/* Scaled Score / 500 & Performance Level */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-xl mx-auto py-1">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-xs text-indigo-200 block font-medium">Puntaje Global Estimado</span>
            <div className="text-4xl sm:text-5xl font-black text-amber-300 font-mono mt-1">
              {result.globalScoreScaled}
              <span className="text-xs text-indigo-300 font-normal"> / 500</span>
            </div>
            <span className="text-[10px] text-indigo-200 mt-1 block">Escala Oficial ICFES</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-xs text-indigo-200 block font-medium">Nivel de Desempeño</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-2">
              {tierName}
            </div>
            <span className="text-[10px] text-indigo-300 mt-1 block">Clasificación MEN</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-xs text-indigo-200 block font-medium">Porcentaje de Precisión</span>
            <div className="text-4xl sm:text-5xl font-black text-emerald-300 font-mono mt-1">
              {result.globalPercentage}%
            </div>
            <span className="text-[10px] text-indigo-200 mt-1 block">
              {result.correctCount} de {result.totalQuestions} aciertos
            </span>
          </div>
        </div>

        {/* Quick Numbers Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto text-xs">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-indigo-200 block">Correctas</span>
            <strong className="text-base text-emerald-300 font-mono">{result.correctCount}</strong>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-indigo-200 block">Incorrectas</span>
            <strong className="text-base text-rose-300 font-mono">{result.incorrectCount}</strong>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-indigo-200 block">Sin responder</span>
            <strong className="text-base text-slate-300 font-mono">{result.unansweredCount}</strong>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-indigo-200 block">Tiempo empleado</span>
            <strong className="text-base text-blue-300 font-mono">
              {Math.floor(result.timeUsedSeconds / 60)}m {result.timeUsedSeconds % 60}s
            </strong>
          </div>
        </div>
      </div>

      {/* Fortalezas y Debilidades Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fortalezas Card */}
        <div className="p-5 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-100 font-extrabold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Tus Fortalezas Consolidadas</span>
          </div>
          {strengths.length > 0 ? (
            <div className="space-y-2">
              {strengths.map((areaKey) => {
                const meta = AREA_METADATA[areaKey];
                const score = result.areaBreakdown[areaKey];
                return (
                  <div
                    key={areaKey}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {meta.name}
                    </span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-lg">
                      {score.percentage}% de acierto
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80 italic">
              Continúa repasando las áreas evaluadas para convertir tus competencias en fortalezas.
            </p>
          )}
        </div>

        {/* Debilidades / Oportunidades de Mejora Card */}
        <div className="p-5 rounded-3xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-3">
          <div className="flex items-center gap-2 text-rose-900 dark:text-rose-100 font-extrabold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>Oportunidades Prioritarias de Mejora</span>
          </div>
          {weaknesses.length > 0 ? (
            <div className="space-y-2">
              {weaknesses.map((areaKey) => {
                const meta = AREA_METADATA[areaKey];
                const score = result.areaBreakdown[areaKey];
                return (
                  <div
                    key={areaKey}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/60 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {meta.name}
                    </span>
                    <span className="font-mono font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-lg">
                      {score.percentage}% de acierto
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-rose-800/80 dark:text-rose-200/80 italic">
              ¡Sin áreas críticas deficientes! Tu preparación es equilibrada.
            </p>
          )}
        </div>
      </div>

      {/* Breakdown by Area 360° */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>Desglose 360° por Áreas Evaluadas</span>
        </h3>

        <div className="space-y-3">
          {areasList.map((areaKey) => {
            const meta = AREA_METADATA[areaKey];
            const areaScore = result.areaBreakdown[areaKey];
            const isStrong = areaScore.percentage >= 60;

            return (
              <div
                key={areaKey}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${meta.badgeBg}`}>
                    {meta.shortName}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {areaScore.correct} de {areaScore.total} preguntas correctas
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isStrong
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {isStrong ? 'Fortaleza' : 'Reforzar'}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-1 max-w-xs">
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        areaScore.percentage >= 70
                          ? 'bg-emerald-500'
                          : areaScore.percentage >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${areaScore.percentage}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[40px]">
                    {areaScore.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic 7-day Plan Recommendations */}
      <div className="p-6 rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-amber-950 dark:text-amber-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-600" />
          <span>Recomendaciones Estratégicas y Plan de Acción</span>
        </h3>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-800/50 space-y-2">
          <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
            Plan para los próximos 7 días:
          </span>
          <ul className="space-y-2 pt-1 text-xs text-slate-700 dark:text-slate-200">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => setCurrentView('study_plan')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Ver Plan de Estudio Personalizado</span>
          </button>
          <button
            onClick={() => setCurrentView('mistakes')}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Practicar Banco de Errores
          </button>
          <button
            onClick={() => setCurrentView('mock_select')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            Nuevo Simulacro
          </button>
        </div>
      </div>

      {/* Accordion / Toggle for detailed questions review */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <button
          onClick={() => setShowQuestionReview(!showQuestionReview)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Revisión Detallada de Preguntas ({evaluatedQuestions.length})
            </h3>
          </div>
          {showQuestionReview ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {showQuestionReview && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {evaluatedQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                selectedAnswer={result.userAnswers[q.id]}
                showExplanation={true}
                mode="review"
                questionNumber={idx + 1}
                totalQuestions={evaluatedQuestions.length}
              />
            ))}
          </div>
        )}
      </div>

      <DisclaimerNotice />
    </div>
  );
};
