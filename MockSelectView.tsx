import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import {
  Play,
  PlayCircle,
  PlusCircle,
  Clock,
  ShieldCheck,
  Trophy,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

interface MockSelectViewProps {
  onNavigateToPractice?: (sessionId: string, answers: any, timeElapsed: number) => void;
}

export const MockSelectView: React.FC<MockSelectViewProps> = ({ onNavigateToPractice }) => {
  const { setCurrentView, profile, setActiveMockResult, setActiveSessionData } = useApp();
  const [activeSession, setActiveSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsLoading(false);
          return;
        }

        // Buscamos si hay un simulacro 'in_progress'
        const { data, error } = await supabase
          .from('practice_sessions')
          .select('*')
          .eq('status', 'in_progress')
          .eq('user_id', session.user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          setActiveSession(data);
        }
      } catch (error) {
        console.error("No se encontraron sesiones activas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveSession();
  }, []);

  const navigateToMock = (sessionId: string, answers: any, timeElapsed: number) => {
    if (onNavigateToPractice) {
      onNavigateToPractice(sessionId, answers, timeElapsed);
    } else {
      setActiveSessionData({ sessionId, answers, timeElapsed });
      setCurrentView('mock_exam');
    }
  };

  // Función para crear un simulacro desde cero
  const handleStartNewMock = async (subjectArea: string) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Fallback local si no hay sesión iniciada
        const localId = typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : '00000000-0000-4000-8000-000000000000';
        navigateToMock(localId, {}, 0);
        return;
      }

      const { data, error } = await supabase
        .from('practice_sessions')
        .insert([{ 
          user_id: session.user.id,
          subject: subjectArea, 
          status: 'in_progress', 
          answers: {}, 
          time_elapsed: 0 
        }])
        .select()
        .single();

      if (data && !error) {
        // Redirigimos a la vista de práctica con el nuevo ID
        navigateToMock(data.id, data.answers || {}, data.time_elapsed || 0);
      } else {
        console.warn('Nota al crear sesión en Supabase:', error?.message);
        const fallbackId = typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : '00000000-0000-4000-8000-000000000000';
        navigateToMock(fallbackId, {}, 0);
      }
    } catch (err) {
      console.warn('Error al iniciar simulacro:', err);
      const fallbackId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : '00000000-0000-4000-8000-000000000000';
      navigateToMock(fallbackId, {}, 0);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para reanudar el simulacro guardado
  const handleContinueMock = () => {
    if (activeSession) {
      navigateToMock(
        activeSession.id, 
        activeSession.answers || {}, 
        activeSession.time_elapsed || 0
      );
    }
  };

  // Función para descartar el simulacro activo en pausa
  const handleDiscardActiveSession = async () => {
    if (!activeSession) return;
    try {
      await supabase
        .from('practice_sessions')
        .delete()
        .eq('id', activeSession.id);
      setActiveSession(null);
      try {
        localStorage.removeItem('draft_mock_exam_active');
        localStorage.removeItem('draft_mock_exam_active_id');
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.warn('Error al descartar simulacro:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400 font-semibold space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Cargando simulacros y sincronizando con la nube...</p>
      </div>
    );
  }

  const mockPresets = [
    {
      id: 'simulacro_global',
      title: 'Simulacro Global (120 Preguntas)',
      subtitle: 'Evalúa todas las áreas: Matemáticas, Lectura Crítica, Sociales, Ciencias e Inglés.',
      questionsCount: 120,
      timeMinutes: 60,
      badge: 'Estándar Saber 11°',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    },
    {
      id: 'simulacro_stem',
      title: 'Simulacro Especial STEM (Matemáticas y Ciencias)',
      subtitle: 'Enfocado en razonamiento cuantitativo, cálculo, física, química y biología.',
      questionsCount: 40,
      timeMinutes: 45,
      badge: 'Área Cuantitativa',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      id: 'simulacro_humanidades',
      title: 'Simulacro Lectura Crítica y Sociales',
      subtitle: 'Textos continuos, discontinuos, Constitución Política y multiperspectivismo.',
      questionsCount: 40,
      timeMinutes: 45,
      badge: 'Área Humanidades',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      id: 'simulacro_ingles_ciudadanas',
      title: 'Simulacro Inglés y Competencias Ciudadanas',
      subtitle: 'Comprensión de lectura B1, pragmática, diálogo y resolución pacífica de conflictos.',
      questionsCount: 30,
      timeMinutes: 30,
      badge: 'Diagnóstico Rápido',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto text-slate-900 dark:text-white space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-2.5">
          <Clock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          <span>Selecciona tu Simulacro</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Entrena bajo condiciones reales de examen: temporizador oficial, navegación libre, marcación para revisar y reporte 360° al finalizar.
        </p>
      </div>

      {/* Banner de Reanudación de Sesión (Solo aparece si hay una activa) */}
      {activeSession && (
        <div className="bg-blue-600/15 dark:bg-blue-600/20 border border-blue-500/80 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in zoom-in-95 duration-150">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
              <h3 className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">Simulacro en Pausa</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">
              Tienes un simulacro de <span className="font-bold capitalize text-slate-800 dark:text-white">{activeSession.subject.replace(/_/g, ' ')}</span> en curso.{' '}
              Llevas <strong>{Object.keys(activeSession.answers || {}).length}</strong> preguntas respondidas.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button 
              onClick={handleContinueMock}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 sm:px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <PlayCircle size={20} />
              <span>Continuar Simulacro</span>
            </button>
            <button
              onClick={handleDiscardActiveSession}
              title="Descartar este simulacro y empezar uno nuevo"
              className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Grid de opciones para nuevos simulacros */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
          Opciones de Examen Disponibles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mockPresets.map((preset) => {
            const isBlocked = activeSession !== null;

            return (
              <div
                key={preset.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400 dark:hover:border-slate-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${preset.badgeColor}`}>
                      {preset.badge}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono font-medium">
                      <Clock className="w-3.5 h-3.5" /> {preset.timeMinutes} mins
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                    {preset.title}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 leading-relaxed">
                    {preset.subtitle}
                  </p>
                </div>

                <div>
                  <button 
                    onClick={() => handleStartNewMock(preset.id)}
                    disabled={isBlocked}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isBlocked
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-800'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-98'
                    }`}
                  >
                    <PlusCircle size={17} />
                    <span>{isBlocked ? 'Tienes un simulacro activo' : 'Iniciar Nuevo'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules & Examination Advice */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 space-y-2">
        <div className="font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Reglas del Examen Saber 11°:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-indigo-800 dark:text-indigo-300">
          <li>El progreso se guarda automáticamente en la nube a medida que respondes.</li>
          <li>Puedes pausar el simulacro y reanudarlo cuando quieras desde esta misma pantalla.</li>
          <li>Al terminar, recibirás tu puntaje global proyectado (0-500) y desglose por competencias.</li>
        </ul>
      </div>

      {/* Past Mock History */}
      {profile && profile.mockHistory && profile.mockHistory.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Tus Simulacros Anteriores</span>
          </h3>

          <div className="space-y-2.5">
            {profile.mockHistory.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Simulacro Saber 11° ({new Date(m.timestamp).toLocaleDateString('es-CO')})
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {m.correctCount} correctas de {m.totalQuestions} ({m.globalPercentage}%)
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">
                      {m.globalScoreScaled} / 500
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveMockResult(m);
                      setCurrentView('mock_result');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    Ver Análisis
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <DisclaimerNotice />
    </div>
  );
};
