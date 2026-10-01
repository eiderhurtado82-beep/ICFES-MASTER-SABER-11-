import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Question, SubjectArea, MockExamResult } from '../types';
import { INITIAL_QUESTIONS, AREA_METADATA } from '../data/questions';
import { QuestionCard } from '../components/QuestionCard';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock,
  Compass,
  Calendar,
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronUp,
  Target,
  Flame,
} from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const DiagnosticView: React.FC = () => {
  const {
    profile,
    setCurrentView,
    saveMockResult,
    generateAutoStudyPlan,
    recordQuestionAnswer,
    triggerConfettiCelebration,
  } = useApp();

  // Curate 10 balanced questions (2 for each of the 5 Saber 11 areas)
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<Question[]>(() => {
    const areas: SubjectArea[] = [
      'MATEMATICAS',
      'LECTURA_CRITICA',
      'CIENCIAS_NATURALES',
      'SOCIALES_CIUDADANAS',
      'INGLES',
    ];
    const selected: Question[] = [];
    areas.forEach((area) => {
      const qInArea = INITIAL_QUESTIONS.filter((q) => q.area === area);
      selected.push(...qInArea.slice(0, 2));
    });
    return selected;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<MockExamResult | null>(null);
  const [showReview, setShowReview] = useState(false);

  // Timer that runs continuously without resetting when changing questions
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.max(1, Math.round((Date.now() - startTime) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  if (!profile) return null;

  const currentQ = diagnosticQuestions[currentIndex];
  const isLast = currentIndex === diagnosticQuestions.length - 1;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: opt }));
  };

  const handleFinish = () => {
    const totalTimeSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const areaBreakdown: Record<SubjectArea, { total: number; correct: number; percentage: number }> = {
      MATEMATICAS: { total: 0, correct: 0, percentage: 0 },
      LECTURA_CRITICA: { total: 0, correct: 0, percentage: 0 },
      CIENCIAS_NATURALES: { total: 0, correct: 0, percentage: 0 },
      SOCIALES_CIUDADANAS: { total: 0, correct: 0, percentage: 0 },
      INGLES: { total: 0, correct: 0, percentage: 0 },
    };

    diagnosticQuestions.forEach((q) => {
      const userAns = answers[q.id];
      areaBreakdown[q.area].total += 1;

      if (!userAns) {
        unansweredCount += 1;
      } else if (userAns === q.respuestaCorrecta) {
        correctCount += 1;
        areaBreakdown[q.area].correct += 1;
        recordQuestionAnswer(q, userAns, 'diagnostic');
      } else {
        incorrectCount += 1;
        recordQuestionAnswer(q, userAns, 'diagnostic');
      }
    });

    // Calculate percentages
    Object.keys(areaBreakdown).forEach((areaKey) => {
      const a = areaBreakdown[areaKey as SubjectArea];
      a.percentage = a.total > 0 ? Math.round((a.correct / a.total) * 100) : 0;
    });

    const globalPercentage = Math.round((correctCount / diagnosticQuestions.length) * 100);
    // Saber 11 scaled score: from 0 to 500 points
    const globalScoreScaled = Math.round((globalPercentage / 100) * 500);

    // Identify strengths (>= 60%) and weaknesses (< 60%)
    const allAreas = Object.keys(areaBreakdown) as SubjectArea[];
    const weakAreas = allAreas.filter((area) => areaBreakdown[area].percentage < 60);

    const recommendations: string[] = [];
    if (areaBreakdown.MATEMATICAS.percentage < 60) {
      recommendations.push('Reforzar proporcionalidad, porcentajes sucesivos y razonamiento geométrico.');
    }
    if (areaBreakdown.LECTURA_CRITICA.percentage < 60) {
      recommendations.push('Practicar identificación de la tesis central y distinción de premisas frente a opiniones.');
    }
    if (areaBreakdown.CIENCIAS_NATURALES.percentage < 60) {
      recommendations.push('Estudiar metodología de indagación, variables de control y leyes fundamentales de física y química.');
    }
    if (areaBreakdown.SOCIALES_CIUDADANAS.percentage < 60) {
      recommendations.push('Repasar la Constitución Política de 1991, tutela y multiperspectivismo en conflictos.');
    }
    if (areaBreakdown.INGLES.percentage < 60) {
      recommendations.push('Ampliar vocabulario contextual (Partes 1 a 3) y uso de conectores causa-contraste.');
    }
    if (recommendations.length === 0) {
      recommendations.push('¡Excelente desempeño base! Enfócate en resolver simulacros cronometrados para optimizar velocidad.');
    }

    const calculatedResult: MockExamResult = {
      id: `diag-${Date.now()}`,
      timestamp: Date.now(),
      totalQuestions: diagnosticQuestions.length,
      correctCount,
      incorrectCount,
      unansweredCount,
      timeUsedSeconds: totalTimeSec,
      timeLimitSeconds: 1200,
      globalScoreScaled,
      globalPercentage,
      areaBreakdown,
      weakCompetencies: weakAreas.map((a) => AREA_METADATA[a].name),
      recommendations,
      userAnswers: answers,
    };

    setResult(calculatedResult);
    setIsFinished(true);
    saveMockResult(calculatedResult, true);

    // Automatically generate custom study plan based on weak areas
    generateAutoStudyPlan(
      profile.fechaExamen,
      profile.tiempoDiarioMinutos,
      weakAreas.length > 0 ? weakAreas : ['MATEMATICAS', 'LECTURA_CRITICA'],
      profile.metaPuntaje
    );

    if (globalPercentage >= 60) {
      triggerConfettiCelebration();
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
    setResult(null);
    setShowReview(false);
  };

  const formatSecs = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder.toString().padStart(2, '0')}`;
  };

  // If finished, render the "Análisis y Plan de Estudio Generado" View
  if (isFinished && result) {
    let performanceTier = 'Satisfactorio';
    let performanceBadge = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
    let performanceDesc = 'Demuestras una sólida base conceptual para iniciar tu entrenamiento intensivo.';

    if (result.globalScoreScaled < 250) {
      performanceTier = 'Insuficiente';
      performanceBadge = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      performanceDesc = 'Se identifican vacíos conceptuales que abordaremos de inmediato en tu plan semanal.';
    } else if (result.globalScoreScaled < 320) {
      performanceTier = 'Mínimo';
      performanceBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      performanceDesc = 'Cuentas con nociones generales, con oportunidad de elevar argumentación y razonamiento.';
    } else if (result.globalScoreScaled >= 400) {
      performanceTier = 'Avanzado';
      performanceBadge = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      performanceDesc = '¡Rendimiento sobresaliente! Tu meta de puntaje alto está al alcance con simulacros regulares.';
    }

    const areasList = Object.keys(result.areaBreakdown) as SubjectArea[];
    const strengths = areasList.filter((a) => result.areaBreakdown[a].percentage >= 60);
    const weaknesses = areasList.filter((a) => result.areaBreakdown[a].percentage < 60);
    const avgTimePerQuestion = Math.round(result.timeUsedSeconds / result.totalQuestions);

    return (
      <div className="space-y-6 pb-16 animate-in fade-in duration-200">
        {/* Result Header Hero: Análisis y Plan de Estudio Generado */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-950 text-white shadow-xl text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-xs font-bold text-amber-300 backdrop-blur-md border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Análisis y Plan de Estudio Generado</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black">
            Tu Diagnóstico de Partida Saber 11°
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 min-w-[160px]">
              <div className="text-xs text-indigo-200 font-medium">Puntaje Proyectado</div>
              <div className="text-4xl sm:text-5xl font-black text-amber-300 font-mono mt-1">
                {result.globalScoreScaled}
                <span className="text-sm text-indigo-300 font-normal"> / 500</span>
              </div>
              <span className="text-[10px] text-indigo-200 mt-1 block">Escala ICFES 0 a 500</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 min-w-[160px]">
              <div className="text-xs text-indigo-200 font-medium">Nivel de Desempeño</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                {performanceTier}
              </div>
              <span className="text-[10px] text-indigo-300 mt-1 block">Clasificación Inicial</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 min-w-[160px]">
              <div className="text-xs text-indigo-200 font-medium">Precisión General</div>
              <div className="text-4xl sm:text-5xl font-black text-emerald-300 font-mono mt-1">
                {result.globalPercentage}%
              </div>
              <span className="text-[10px] text-indigo-200 mt-1 block">
                {result.correctCount} de {result.totalQuestions} aciertos
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl mx-auto">
            {performanceDesc} Hemos generado automáticamente tu plan de estudio semanal con base en estos resultados.
          </p>
        </div>

        {/* Fortalezas y Debilidades Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fortalezas Detectadas */}
          <div className="p-6 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-100 font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Tus Fortalezas Detectadas</span>
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
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200 block">
                          {meta.name}
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          {score.correct} de {score.total} correctas
                        </span>
                      </div>
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg">
                        {score.percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80 italic">
                Aún no superas el 60% en ninguna materia. ¡No te preocupes! El plan de estudio está calibrado para nivelarte paso a paso.
              </p>
            )}
          </div>

          {/* Debilidades y Oportunidades de Mejora */}
          <div className="p-6 rounded-3xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-900 dark:text-rose-100 font-extrabold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>Debilidades y Oportunidades de Mejora</span>
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
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200 block">
                          {meta.name}
                        </strong>
                        <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                          Prioridad alta en tu plan
                        </span>
                      </div>
                      <span className="font-mono font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-1 rounded-lg">
                        {score.percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-rose-800/80 dark:text-rose-200/80 italic">
                ¡Excelente balance! Mantén el entrenamiento constante para asegurar tu meta de puntaje.
              </p>
            )}
          </div>
        </div>

        {/* Detailed Breakdown by Subject Area */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Resultado por Área de Conocimiento</span>
          </h3>

          <div className="space-y-3">
            {areasList.map((areaKey) => {
              const meta = AREA_METADATA[areaKey];
              const score = result.areaBreakdown[areaKey];
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
                      {score.correct} de {score.total} correctas
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-1 max-w-xs">
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          score.percentage >= 70
                            ? 'bg-emerald-500'
                            : score.percentage >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${score.percentage}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[40px]">
                      {score.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-500 dark:text-slate-400 block">Correctas</span>
              <strong className="text-base text-emerald-600 dark:text-emerald-400 font-mono">
                {result.correctCount}
              </strong>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-500 dark:text-slate-400 block">Incorrectas</span>
              <strong className="text-base text-rose-600 dark:text-rose-400 font-mono">
                {result.incorrectCount}
              </strong>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-500 dark:text-slate-400 block">Sin responder</span>
              <strong className="text-base text-slate-600 dark:text-slate-300 font-mono">
                {result.unansweredCount}
              </strong>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-500 dark:text-slate-400 block">Tiempo promedio</span>
              <strong className="text-base text-blue-600 dark:text-blue-400 font-mono">
                {avgTimePerQuestion}s / preg
              </strong>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations & 7-Day Plan Generated */}
        <div className="p-6 rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-amber-950 dark:text-amber-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            <span>Plan de Estudio Semanal Generado Automáticamente</span>
          </h3>

          <p className="text-xs text-amber-900/90 dark:text-amber-200/90">
            Con base en tus áreas de oportunidad ({weaknesses.map((w) => AREA_METADATA[w].shortName).join(', ') || 'repaso general'}), hemos configurado tu cronograma semanal de {profile.tiempoDiarioMinutos} minutos diarios:
          </p>

          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('study_plan')}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Ver y Seguir mi Plan de Estudio</span>
            </button>

            <button
              onClick={() => setShowReview(!showReview)}
              className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>{showReview ? 'Ocultar Preguntas' : 'Repasar Preguntas y Explicaciones'}</span>
            </button>

            <button
              onClick={handleRestart}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repetir Diagnóstico</span>
            </button>

            <button
              onClick={() => setCurrentView('home')}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Ir al Panel Principal
            </button>
          </div>
        </div>

        {/* Detailed Questions Review Accordion */}
        {showReview && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Revisión Detallada de las 10 Preguntas Diagnósticas</span>
            </h3>

            <div className="space-y-6">
              {diagnosticQuestions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  selectedAnswer={result.userAnswers[q.id]}
                  showExplanation={true}
                  mode="review"
                  questionNumber={idx + 1}
                  totalQuestions={diagnosticQuestions.length}
                />
              ))}
            </div>
          </div>
        )}

        <DisclaimerNotice />
      </div>
    );
  }

  // Active Diagnostic Test Presentation Flow
  return (
    <div className="space-y-5 pb-16 animate-in fade-in duration-200">
      {/* Test Progress & Time Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
            Prueba Diagnóstica Oficial Saber 11°
          </span>{' '}
          <span className="text-slate-500">
            ({answeredCount} de {diagnosticQuestions.length} respondidas)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatSecs(elapsedSeconds)}</span>
          </div>
          <span className="text-slate-700 dark:text-slate-300 font-bold font-mono">
            {currentIndex + 1} / {diagnosticQuestions.length}
          </span>
        </div>
      </div>

      {/* Progress pill bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / diagnosticQuestions.length) * 100}%`,
          }}
        />
      </div>

      {/* Current Question */}
      <QuestionCard
        question={currentQ}
        selectedAnswer={answers[currentQ.id]}
        onSelectAnswer={handleSelectOption}
        mode="exam"
        questionNumber={currentIndex + 1}
        totalQuestions={diagnosticQuestions.length}
      />

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        {isLast ? (
          <button
            onClick={handleFinish}
            disabled={answeredCount === 0}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Finalizar y Generar Plan</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(diagnosticQuestions.length - 1, prev + 1))}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Siguiente</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <DisclaimerNotice compact />
    </div>
  );
};
