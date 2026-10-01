import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { finishPractice, evaluateAndSaveMistakes } from '../lib/practice';
import { Question, SubjectArea, MockExamResult } from '../types';
import { INITIAL_QUESTIONS, AREA_METADATA } from '../data/questions';
import { QuestionCard } from '../components/QuestionCard';
import { QuestionGrid } from '../components/QuestionGrid';
import {
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  Pause,
  Play,
  X,
  Send,
  HelpCircle,
} from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

interface MockExamViewProps {
  sessionId?: string;
  initialAnswers?: Record<string, 'A' | 'B' | 'C' | 'D'>;
  initialTimeElapsed?: number;
}

export const MockExamView: React.FC<MockExamViewProps> = ({
  sessionId: customSessionId,
  initialAnswers = {},
  initialTimeElapsed = 0,
}) => {
  const { setCurrentView, saveMockResult, setActiveMockResult, recordQuestionAnswer, triggerConfettiCelebration } =
    useApp();

  // Curate 12 representative exam questions across all 5 Saber 11 areas
  const [examQuestions] = useState<Question[]>(() => {
    const areas: SubjectArea[] = [
      'MATEMATICAS',
      'LECTURA_CRITICA',
      'CIENCIAS_NATURALES',
      'SOCIALES_CIUDADANAS',
      'INGLES',
    ];
    const picked: Question[] = [];
    areas.forEach((area) => {
      const qInArea = INITIAL_QUESTIONS.filter((q) => q.area === area);
      // Pick 2-3 per area to total 12
      const count = area === 'MATEMATICAS' || area === 'LECTURA_CRITICA' ? 3 : 2;
      picked.push(...qInArea.slice(0, count));
    });
    return picked.length > 0 ? picked : INITIAL_QUESTIONS.slice(0, 12);
  });

  const [sessionId] = useState<string>(() => {
    if (customSessionId) return customSessionId;
    try {
      const savedActive = localStorage.getItem('draft_mock_exam_active_id');
      if (savedActive) return savedActive;
    } catch (e) {
      // ignore
    }
    const newUuid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : '00000000-0000-4000-8000-000000000000'.replace(/[08]/g, (s) =>
            ((Math.random() * 16) | 0).toString(16)
          );
    try {
      localStorage.setItem('draft_mock_exam_active_id', newUuid);
    } catch (e) {
      // ignore
    }
    return newUuid;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>(() => {
    if (initialAnswers && Object.keys(initialAnswers).length > 0) {
      return initialAnswers;
    }
    try {
      const savedDraft = localStorage.getItem('draft_mock_exam_active');
      if (savedDraft) return JSON.parse(savedDraft);
    } catch (e) {
      console.warn('Error al leer borrador local de simulacro:', e);
    }
    return {};
  });
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);
  const [showAnswerSheet, setShowAnswerSheet] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // 1 hora completa = 3600 segundos (según especificación del examen oficial)
  const INITIAL_TIME_SECONDS = 3600;
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (initialTimeElapsed && initialTimeElapsed > 0) {
      return Math.max(60, INITIAL_TIME_SECONDS - initialTimeElapsed);
    }
    return INITIAL_TIME_SECONDS;
  });

  // Timer countdown: does NOT reset when changing questions (currentIndex)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          executeFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const currentQ = examQuestions[currentIndex];
  const isFlagged = currentQ ? !!flagged[currentQ.id] : false;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = examQuestions.length - answeredCount;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  const handleToggleFlag = () => {
    if (!currentQ) return;
    setFlagged((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  // Función que se ejecuta cuando el estudiante elige una opción (A, B, C, D)
  const handleSelectAnswer = (option: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQ) return;
    const newAnswers = { ...answers, [currentQ.id]: option };
    
    // 1. Actualización optimista en la UI
    setAnswers(newAnswers);

    // 2. Guardado ultra-rápido en LocalStorage (Respaldo offline)
    try {
      localStorage.setItem(`draft_session_${sessionId}`, JSON.stringify(newAnswers));
      localStorage.setItem('draft_mock_exam_active', JSON.stringify(newAnswers));
    } catch (e) {
      console.warn('Error guardando en LocalStorage:', e);
    }

    // 3. Sincronización con Supabase (Debounce de 2 segundos)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setIsSaving(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const timeElapsedSec = Math.max(1, INITIAL_TIME_SECONDS - timeLeft);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('practice_sessions')
            .upsert(
              {
                id: sessionId,
                user_id: user.id,
                subject: 'SIMULACRO_OFICIAL_SABER_11',
                status: 'in_progress',
                answers: newAnswers,
                time_elapsed: timeElapsedSec,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'id' }
            );

          if (error) {
            console.warn('Nota de sincronización Supabase:', error.message);
          }
        }
      } catch (err) {
        console.warn('Error sincronizando con Supabase:', err);
      } finally {
        setIsSaving(false);
      }
    }, 2000); // Espera 2 segundos después del último clic para subir a la BD
  };

  const executeFinishExam = () => {
    const totalTimeUsedSec = Math.max(1, INITIAL_TIME_SECONDS - timeLeft);

    try {
      localStorage.removeItem(`draft_session_${sessionId}`);
      localStorage.removeItem('draft_mock_exam_active');
      localStorage.removeItem('draft_mock_exam_active_id');
    } catch (e) {
      // ignore
    }
    setShowAnswerSheet(false);
    setShowConfirmSubmit(false);

    let correctCount = 0;
    let incorrectCount = 0;
    let unansCount = 0;

    const areaBreakdown: Record<SubjectArea, { total: number; correct: number; percentage: number }> = {
      MATEMATICAS: { total: 0, correct: 0, percentage: 0 },
      LECTURA_CRITICA: { total: 0, correct: 0, percentage: 0 },
      CIENCIAS_NATURALES: { total: 0, correct: 0, percentage: 0 },
      SOCIALES_CIUDADANAS: { total: 0, correct: 0, percentage: 0 },
      INGLES: { total: 0, correct: 0, percentage: 0 },
    };

    examQuestions.forEach((q) => {
      const userAns = answers[q.id];
      areaBreakdown[q.area].total += 1;

      if (!userAns) {
        unansCount += 1;
      } else if (userAns === q.respuestaCorrecta) {
        correctCount += 1;
        areaBreakdown[q.area].correct += 1;
        recordQuestionAnswer(q, userAns, 'mock');
      } else {
        incorrectCount += 1;
        recordQuestionAnswer(q, userAns, 'mock');
      }
    });

    // 1. Marcar el simulacro como completado y 2. Sumar XP al perfil (con RPC atómico)
    const mockEarnedXP = Math.max(50, Math.round(correctCount * 15 + 25));
    finishPractice(sessionId, mockEarnedXP, {
      answers,
      timeElapsed: totalTimeUsedSec,
    });

    // 3. Evaluar y guardar en lote todos los errores en user_mistakes
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        evaluateAndSaveMistakes(session.user.id, answers, examQuestions);
      }
    });

    Object.keys(areaBreakdown).forEach((areaKey) => {
      const a = areaBreakdown[areaKey as SubjectArea];
      a.percentage = a.total > 0 ? Math.round((a.correct / a.total) * 100) : 0;
    });

    const globalPercentage = Math.round((correctCount / examQuestions.length) * 100);
    // Saber 11 scaled score: 0 to 500
    const globalScoreScaled = Math.round((globalPercentage / 100) * 500);

    const weakAreas = (Object.keys(areaBreakdown) as SubjectArea[]).filter(
      (a) => areaBreakdown[a].percentage < 60
    );

    const recommendations: string[] = [
      'Durante los próximos 7 días debes priorizar ejercicios contrarreloj de 2 minutos por pregunta.',
    ];
    if (weakAreas.length > 0) {
      recommendations.push(
        `Reforzar de manera intensiva las áreas críticas: ${weakAreas
          .map((a) => AREA_METADATA[a].name)
          .join(', ')}.`
      );
    } else {
      recommendations.push(
        '¡Desempeño destacado en todas las áreas evaluadas! Mantén el ritmo con simulacros semanales.'
      );
    }

    const examResult: MockExamResult = {
      id: `mock-${Date.now()}`,
      timestamp: Date.now(),
      totalQuestions: examQuestions.length,
      correctCount,
      incorrectCount,
      unansweredCount: unansCount,
      timeUsedSeconds: totalTimeUsedSec,
      timeLimitSeconds: INITIAL_TIME_SECONDS,
      globalScoreScaled,
      globalPercentage,
      areaBreakdown,
      weakCompetencies: weakAreas.map((a) => AREA_METADATA[a].name),
      recommendations,
      userAnswers: answers,
    };

    saveMockResult(examResult);
    setActiveMockResult(examResult);

    if (globalPercentage >= 70) {
      triggerConfettiCelebration();
    }

    // Redirect to MockResultView
    setCurrentView('mock_result');
  };

  // Format time: HH:MM:SS or MM:SS
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${remainingSecs
        .toString()
        .padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${remainingSecs
      .toString()
      .padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 300; // Less than 5 minutes

  return (
    <div className="space-y-4 pb-16 animate-in fade-in duration-150">
      <header className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
          Simulacro en curso
        </h2>
        {/* Indicador visual para darle tranquilidad al usuario */}
        <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          {isSaving ? 'Guardando progreso...' : 'Progreso guardado en la nube ☁️'}
        </span>
      </header>

      {/* Distraction-Free Exam Top Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2 text-xs">
        {/* Left: Button to toggle Answer Sheet (QuestionGrid) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnswerSheet(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold transition-all border border-indigo-200/60 dark:border-indigo-800/60 cursor-pointer shadow-xs"
            title="Abrir Hoja de Respuestas"
          >
            <LayoutGrid className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Hoja de Respuestas</span>
            <span className="px-1.5 py-0.2 rounded-md bg-indigo-600 text-white font-mono text-[10px] font-bold">
              {answeredCount}/{examQuestions.length}
            </span>
          </button>
        </div>

        {/* Center Progress indicator */}
        <div className="font-extrabold text-slate-700 dark:text-slate-300 text-xs sm:text-sm text-center">
          Pregunta {currentIndex + 1} de {examQuestions.length}
        </div>

        {/* Right: Persistent Timer (Doesn't reset on question change) & Pause */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-xs sm:text-sm ${
              isLowTime
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title={isPaused ? 'Reanudar examen' : 'Pausar examen'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Paused Banner */}
      {isPaused && (
        <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center mx-auto text-amber-800 dark:text-amber-100">
            <Pause className="w-6 h-6" />
          </div>
          <h3 className="font-black text-lg text-amber-950 dark:text-amber-100">
            Simulacro Pausado
          </h3>
          <p className="text-xs text-amber-900/80 dark:text-amber-200/80 max-w-sm mx-auto">
            El temporizador está detenido. Para continuar respondiendo las preguntas, haz clic en reanudar.
          </p>
          <button
            onClick={() => setIsPaused(false)}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            Reanudar Examen
          </button>
        </div>
      )}

      {/* Current Question Component (Clean exam mode, no feedback revealed during test) */}
      {!isPaused && currentQ && (
        <QuestionCard
          question={currentQ}
          selectedAnswer={answers[currentQ.id]}
          onSelectAnswer={handleSelectAnswer}
          showExplanation={false}
          mode="exam"
          questionNumber={currentIndex + 1}
          totalQuestions={examQuestions.length}
          isFlagged={isFlagged}
          onToggleFlag={handleToggleFlag}
        />
      )}

      {/* Navigation Bar: [Anterior] [Marcar para revisar] [Hoja de Respuestas] [Siguiente / Entregar Examen] */}
      {!isPaused && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          {/* Flag / Marcar para revisar button */}
          <button
            onClick={handleToggleFlag}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isFlagged
                ? 'bg-amber-500 text-white shadow-xs'
                : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Marcar pregunta actual para revisarla luego en la hoja de respuestas"
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-white' : ''}`} />
            <span>{isFlagged ? 'Pregunta Marcada' : 'Marcar para revisar'}</span>
          </button>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAnswerSheet(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Ver Hoja</span>
            </button>

            {currentIndex === examQuestions.length - 1 ? (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Entregar Examen</span>
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentIndex((prev) => Math.min(examQuestions.length - 1, prev + 1))
                }
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Answer Sheet Modal connecting QuestionGrid component */}
      {showAnswerSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-indigo-600" />
                  <span>Hoja de Respuestas del Simulacro</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Visualiza de un vistazo cuáles preguntas has respondido, cuáles faltan o marcaste para revisar
                </p>
              </div>
              <button
                onClick={() => setShowAnswerSheet(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* The QuestionGrid component connected */}
            <QuestionGrid
              questions={examQuestions}
              currentIndex={currentIndex}
              answers={answers}
              flagged={flagged}
              onSelectQuestion={(idx) => {
                setCurrentIndex(idx);
                setShowAnswerSheet(false);
              }}
            />

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowAnswerSheet(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Continuar Respondiendo
              </button>

              <button
                onClick={() => {
                  setShowAnswerSheet(false);
                  setShowConfirmSubmit(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Entregar Examen</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal before Final Submission */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">
                ¿Deseas entregar tu simulacro?
              </h3>
              <p className="text-xs text-slate-500">
                Una vez entregado, se calificarán tus respuestas y generaremos tu informe de resultados 360°.
              </p>
            </div>

            {/* Summary counters */}
            <div className="grid grid-cols-3 gap-2 py-2 text-xs">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-semibold">
                  Respondidas
                </span>
                <strong className="text-base font-black text-indigo-700 dark:text-indigo-300 font-mono">
                  {answeredCount}
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900">
                <span className="text-[10px] text-rose-600 dark:text-rose-400 block font-semibold">
                  Sin responder
                </span>
                <strong className="text-base font-black text-rose-700 dark:text-rose-300 font-mono">
                  {unansweredCount}
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900">
                <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-semibold">
                  Marcadas
                </span>
                <strong className="text-base font-black text-amber-700 dark:text-amber-300 font-mono">
                  {flaggedCount}
                </strong>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
                ⚠️ Tienes {unansweredCount} pregunta(s) sin responder. Recuerda que en el ICFES no hay puntos negativos por responder.
              </p>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Volver a Revisar
              </button>
              <button
                onClick={executeFinishExam}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Calificar y Entregar</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <DisclaimerNotice compact />
    </div>
  );
};
