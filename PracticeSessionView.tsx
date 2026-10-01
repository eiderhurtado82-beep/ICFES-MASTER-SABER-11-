import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { finishPractice, evaluateAndSaveMistakes } from '../lib/practice';
import { Question } from '../types';
import { INITIAL_QUESTIONS } from '../data/questions';
import { QuestionCard } from '../components/QuestionCard';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  Sparkles,
  Trophy,
  RotateCcw,
  Home,
} from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

interface PracticeSessionViewProps {
  sessionId?: string;
  initialAnswers?: Record<string, 'A' | 'B' | 'C' | 'D'>;
}

export const PracticeSessionView: React.FC<PracticeSessionViewProps> = ({
  sessionId: customSessionId,
  initialAnswers = {},
}) => {
  const {
    activePracticeParams,
    setCurrentView,
    recordQuestionAnswer,
    profile,
    triggerConfettiCelebration,
  } = useApp();

  // Genera o mantiene un UUID válido para la sesión de práctica según el esquema de Supabase
  const [sessionId] = useState<string>(() => {
    if (customSessionId) return customSessionId;
    try {
      const savedActive = localStorage.getItem('draft_session_active_id');
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
      localStorage.setItem('draft_session_active_id', newUuid);
    } catch (e) {
      // ignore
    }
    return newUuid;
  });

  // Estado de las respuestas: { "id_pregunta_1": "A", "id_pregunta_2": "C" }
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>(() => {
    if (initialAnswers && Object.keys(initialAnswers).length > 0) {
      return initialAnswers;
    }
    try {
      const savedDraft = localStorage.getItem(`draft_session_${customSessionId || 'active'}`);
      if (savedDraft) {
        return JSON.parse(savedDraft);
      }
    } catch (e) {
      console.warn('Error al leer borrador local:', e);
    }
    return {};
  });

  const [isSaving, setIsSaving] = useState(false);
  
  // Referencia para manejar el temporizador del debounce
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpieza del temporizador al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Filter or build question session based on practice mode
  const sessionQuestions = useMemo<Question[]>(() => {
    const params = activePracticeParams || { type: 'rapida' };

    let pool = [...INITIAL_QUESTIONS];

    if (params.type === 'errores') {
      const mistakeIds = new Set(
        (profile?.mistakes || []).filter((m) => m.status === 'pending').map((m) => m.questionId)
      );
      const filtered = pool.filter((q) => mistakeIds.has(q.id));
      if (filtered.length > 0) return filtered;
      // If no pending mistakes, return a mix
      return pool.slice(0, 5);
    }

    if (params.area) {
      pool = pool.filter((q) => q.area === params.area);
    }

    if (params.type === 'inteligente') {
      // Prioritize weak areas
      const weakSet = new Set(profile?.areasDificiles || []);
      const weakQ = pool.filter((q) => weakSet.has(q.area));
      const otherQ = pool.filter((q) => !weakSet.has(q.area));
      pool = [...weakQ, ...otherQ];
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());

    let count = 5;
    if (params.type === 'normal') count = 10;
    if (params.type === 'intensiva') count = 20;

    // In case pool has fewer than count, duplicate/wrap
    const result: Question[] = [];
    for (let i = 0; i < count; i++) {
      result.push(shuffled[i % shuffled.length]);
    }

    return result;
  }, [activePracticeParams, profile?.mistakes, profile?.areasDificiles]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPending, setSelectedPending] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [sessionStartTime] = useState<number>(Date.now());
  const [isFinished, setIsFinished] = useState(false);
  const [xpEarnedTotal, setXpEarnedTotal] = useState(0);

  if (!profile) return null;

  const currentQ = sessionQuestions[currentIndex];
  const isAnswered = currentQ ? answers[currentQ.id] !== undefined : false;
  const isLast = currentIndex === sessionQuestions.length - 1;

  // Función que se ejecuta cuando el estudiante elige una opción (A, B, C, D)
  const handleSelectOption = (
    questionIdOrOption: string | 'A' | 'B' | 'C' | 'D',
    optionIdParam?: 'A' | 'B' | 'C' | 'D'
  ) => {
    let qId: string;
    let optionId: 'A' | 'B' | 'C' | 'D';

    if (optionIdParam !== undefined) {
      qId = questionIdOrOption as string;
      optionId = optionIdParam;
    } else {
      if (!currentQ) return;
      qId = currentQ.id;
      optionId = questionIdOrOption as 'A' | 'B' | 'C' | 'D';
    }

    if (isAnswered) return; // ya confirmada y bloqueada

    setSelectedPending(optionId);
    const newAnswers = { ...answers, [qId]: optionId };
    
    // 1. Actualización optimista en la UI
    setAnswers(newAnswers);
    
    // 2. Guardado ultra-rápido en LocalStorage (Respaldo offline)
    try {
      localStorage.setItem(`draft_session_${sessionId}`, JSON.stringify(newAnswers));
      localStorage.setItem(`draft_session_active`, JSON.stringify(newAnswers));
    } catch (e) {
      console.warn('Error guardando en LocalStorage:', e);
    }

    // 3. Sincronización con Supabase (Debounce de 2 segundos)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setIsSaving(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const timeElapsedSec = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
        const subjectName = activePracticeParams?.area || activePracticeParams?.type?.toUpperCase() || 'GENERAL';

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('practice_sessions')
            .upsert(
              {
                id: sessionId,
                user_id: user.id,
                subject: subjectName,
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

  // Confirm and validate current selection
  const handleConfirmAnswer = () => {
    if (!currentQ || !selectedPending || isAnswered) return;

    const chosen = selectedPending;
    const newAnswers = { ...answers, [currentQ.id]: chosen };
    setAnswers(newAnswers);
    recordQuestionAnswer(currentQ, chosen, activePracticeParams?.type);

    try {
      localStorage.setItem(`draft_session_${sessionId}`, JSON.stringify(newAnswers));
      localStorage.setItem(`draft_session_active`, JSON.stringify(newAnswers));
    } catch (e) {
      // ignore
    }

    const isCorrect = chosen === currentQ.respuestaCorrecta;
    const gained = isCorrect ? 15 : 3;
    setXpEarnedTotal((prev) => prev + gained);
  };

  const handleNext = () => {
    if (isLast) {
      setIsFinished(true);
      triggerConfettiCelebration();

      // Marcar simulacro como completado y sumar XP al perfil en Supabase
      const totalTimeSec = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
      finishPractice(sessionId, xpEarnedTotal, {
        answers,
        timeElapsed: totalTimeSec,
      });

      // Evaluar y guardar en lote todos los errores en user_mistakes
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.id) {
          evaluateAndSaveMistakes(session.user.id, answers, sessionQuestions);
        }
      });

      try {
        localStorage.removeItem(`draft_session_${sessionId}`);
        localStorage.removeItem(`draft_session_active`);
        localStorage.removeItem(`draft_session_active_id`);
      } catch (e) {
        // ignore
      }
    } else {
      setSelectedPending(null);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Session Completed Summary
  if (isFinished) {
    let correctCount = 0;
    sessionQuestions.forEach((q) => {
      if (answers[q.id] === q.respuestaCorrecta) {
        correctCount += 1;
      }
    });

    const accuracyPercent = Math.round((correctCount / sessionQuestions.length) * 100);
    const totalTimeSec = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));

    return (
      <div className="space-y-6 pb-16 animate-in fade-in duration-200">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white shadow-xl text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-amber-300">
            <Trophy className="w-3.5 h-3.5" />
            <span>¡Sesión de Práctica Completada!</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black">
            Resumen de tu Desempeño
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 max-w-2xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-xs text-indigo-200 block">Precisión</span>
              <strong className="text-3xl font-black text-amber-300 font-mono">
                {accuracyPercent}%
              </strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-xs text-indigo-200 block">Aciertos</span>
              <strong className="text-3xl font-black text-emerald-300 font-mono">
                {correctCount} / {sessionQuestions.length}
              </strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-xs text-indigo-200 block">Puntos XP</span>
              <strong className="text-3xl font-black text-white font-mono">
                +{xpEarnedTotal}
              </strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-xs text-indigo-200 block">Tiempo Total</span>
              <strong className="text-3xl font-black text-blue-300 font-mono">
                {Math.floor(totalTimeSec / 60)}m {totalTimeSec % 60}s
              </strong>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-indigo-200">
            Los errores cometidos se han sincronizado con tu sección <strong>"Mis Errores"</strong> para programar su repetición espaciada.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setAnswers({});
                setSelectedPending(null);
                setCurrentIndex(0);
                setIsFinished(false);
                setXpEarnedTotal(0);
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practicar Nuevamente</span>
            </button>
            <button
              onClick={() => setCurrentView('practice_select')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
            >
              Cambiar de Modo
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-extrabold text-xs shadow-md hover:bg-slate-100 transition-all flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Panel Principal</span>
            </button>
          </div>
        </div>

        {/* Detailed Questions Review List with Intelligent Explanations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Revisión de Preguntas de la Sesión</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {correctCount} acertadas • {sessionQuestions.length - correctCount} por reforzar
            </span>
          </div>

          <div className="space-y-4">
            {sessionQuestions.map((q, idx) => {
              const userAns = answers[q.id];
              const isCorrectQ = userAns === q.respuestaCorrecta;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
                >
                  <div className="p-4 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isCorrectQ
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {q.tema}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {q.competencia}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-slate-500 text-[11px]">Tu respuesta:</span>
                      <span
                        className={`px-2 py-0.5 rounded-md ${
                          isCorrectQ
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                        }`}
                      >
                        {userAns || 'Sin responder'}
                      </span>
                      {!isCorrectQ && (
                        <>
                          <span className="text-slate-400 text-[11px]">• Correcta:</span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                            {q.respuestaCorrecta}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <QuestionCard
                      question={q}
                      selectedAnswer={userAns}
                      showExplanation={true}
                      mode="review"
                      questionNumber={idx + 1}
                      totalQuestions={sessionQuestions.length}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DisclaimerNotice />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-16 animate-in fade-in duration-200">
      <header className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
          Simulacro en curso
        </h2>
        {/* Indicador visual para darle tranquilidad al usuario */}
        <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          {isSaving ? 'Guardando progreso...' : 'Progreso guardado en la nube ☁️'}
        </span>
      </header>

      {/* Session Progress Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 text-xs">
        <button
          onClick={() => setCurrentView('practice_select')}
          className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Salir</span>
        </button>

        <div className="font-mono font-bold text-slate-700 dark:text-slate-300">
          Pregunta {currentIndex + 1} de {sessionQuestions.length}
        </div>

        <div className="flex items-center gap-1 text-amber-600 font-bold">
          <Zap className="w-4 h-4 fill-amber-500" />
          <span>+{xpEarnedTotal} XP</span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / sessionQuestions.length) * 100}%`,
          }}
        />
      </div>

      {/* Active Question with Instant Explanation */}
      {currentQ && (
        <div className="space-y-4">
          <QuestionCard
            question={currentQ}
            selectedAnswer={isAnswered ? answers[currentQ.id] : (selectedPending || undefined)}
            onSelectAnswer={handleSelectOption}
            showExplanation={isAnswered}
            mode={isAnswered ? 'practice' : 'practice_pending'}
            questionNumber={currentIndex + 1}
            totalQuestions={sessionQuestions.length}
          />

          {/* Action Bar: Confirm selection or Advance to next */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {!isAnswered ? (
              <div className="w-full flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleConfirmAnswer}
                  disabled={!selectedPending}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Respuesta</span>
                </button>
              </div>
            ) : (
              <div className="w-full flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {answers[currentQ.id] === currentQ.respuestaCorrecta ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> ¡Excelente! Respuesta correcta (+15 XP)
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Respuesta incorrecta. Revisa el análisis abajo (+3 XP)
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{isLast ? 'Ver Resultados' : 'Siguiente Pregunta'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <DisclaimerNotice compact />
    </div>
  );
};
