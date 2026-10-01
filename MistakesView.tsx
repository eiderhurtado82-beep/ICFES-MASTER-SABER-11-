import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { BrainCircuit, CheckCircle2, XCircle, ChevronDown, ChevronUp, RefreshCw, Sparkles } from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const MistakesView: React.FC = () => {
  const { profile, resolveMistake, startPractice, triggerConfettiCelebration } = useApp();
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchMistakes();
  }, []);

  const fetchMistakes = async () => {
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { data, error } = await supabase
          .from('user_mistakes')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_resolved', false)
          .order('created_at', { ascending: false });

        if (data && !error && data.length > 0) {
          setMistakes(data);
          setIsLoading(false);
          return;
        }
      }

      // Fallback a los errores almacenados en el perfil local si aún no hay en la BD remota
      if (profile && profile.mistakes) {
        const pendingLocal = profile.mistakes
          .filter((m) => m.status === 'pending')
          .map((m, idx) => ({
            id: `local-${m.questionId}-${idx}`,
            question_id: m.questionId,
            subject: m.area || m.tema || 'GENERAL',
            question_text: `Pregunta sobre ${m.tema || m.area} del banco de práctica`,
            user_answer: m.userAnswer,
            correct_answer: m.correctAnswer,
            ai_explanation: 'Analiza detalladamente las alternativas y los conceptos clave de este enunciado.',
            is_resolved: false,
          }));
        setMistakes(pendingLocal);
      }
    } catch (err) {
      console.warn('Error al consultar user_mistakes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const markAsResolved = async (id: string, questionId?: string) => {
    // Actualización optimista en el estado de la UI
    setMistakes((prev) => prev.filter((m) => m.id !== id));
    triggerConfettiCelebration();

    if (questionId) {
      resolveMistake(questionId);
    }

    try {
      if (!id.startsWith('local-')) {
        await supabase
          .from('user_mistakes')
          .update({ is_resolved: true })
          .eq('id', id);
      }
    } catch (err) {
      console.warn('Error actualizando estado en Supabase:', err);
    }
  };

  const handleStartReview = () => {
    startPractice({ type: 'errores' });
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <p className="text-sm font-medium">Analizando tu historial de respuestas y conceptos en Supabase...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto text-white space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
            <BrainCircuit className="text-blue-500" size={32} />
            Tutor IA: Banco de Errores
          </h2>
          <p className="text-slate-400 text-sm">
            Revisa tus fallos, entiende el porqué y domina cada competencia evaluada.
          </p>
        </div>

        {/* Botón estratégico para retención y práctica de repaso */}
        {mistakes.length > 0 && (
          <button
            onClick={handleStartReview}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer text-sm"
          >
            <RefreshCw size={18} />
            <span>Simulacro de Repaso ({mistakes.length})</span>
          </button>
        )}
      </header>

      {mistakes.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-10 text-center space-y-4">
          <CheckCircle2 className="mx-auto text-emerald-400" size={48} />
          <h3 className="text-xl font-bold text-white">¡Todo perfecto!</h3>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            No tienes errores pendientes por repasar. Continúa entrenando con simulacros contrarreloj para mantener tu nivel.
          </p>
          <button
            onClick={() => startPractice({ type: 'normal' })}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles size={16} />
            Iniciar práctica recomendada
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {mistakes.map((mistake) => (
            <div
              key={mistake.id}
              className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden transition-all shadow-md"
            >
              {/* Cabecera de la tarjeta (Pregunta y respuestas) */}
              <div
                className="p-5 sm:p-6 cursor-pointer hover:bg-slate-750 flex justify-between items-start gap-4 transition-colors"
                onClick={() => toggleExpand(mistake.id)}
              >
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 block">
                    {mistake.subject ? mistake.subject.replace(/_/g, ' ') : 'SABER 11'}
                  </span>
                  <p className="text-base sm:text-lg text-slate-100 font-medium mb-4 leading-relaxed">
                    {mistake.question_text}
                  </p>

                  <div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
                    <div className="flex items-center gap-2 text-rose-400 font-medium">
                      <XCircle size={16} />
                      <span>
                        Tu respuesta: <strong className="font-bold">{mistake.user_answer}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 font-medium">
                      <CheckCircle2 size={16} />
                      <span>
                        Correcta: <strong className="font-bold">{mistake.correct_answer}</strong>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-slate-400 mt-1">
                  {expandedId === mistake.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>

              {/* Sección desplegable: El Tutor IA */}
              {expandedId === mistake.id && (
                <div className="bg-slate-900/90 p-5 sm:p-6 border-t border-slate-700 space-y-4">
                  <h4 className="flex items-center gap-2 font-bold text-blue-400 text-sm sm:text-base">
                    <BrainCircuit size={20} />
                    Explicación del Tutor
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {mistake.ai_explanation ||
                      'La justificación detallada para esta pregunta te ayudará a entender el núcleo de la competencia evaluada.'}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => markAsResolved(mistake.id, mistake.question_id)}
                      className="text-xs sm:text-sm font-semibold border border-slate-600 hover:border-emerald-500 hover:text-emerald-400 px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={16} />
                      Marcar como dominado (+20 XP)
                    </button>
                    <span className="text-xs text-slate-500 hidden sm:inline">
                      ID: {mistake.question_id || mistake.id}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <DisclaimerNotice />
    </div>
  );
};
