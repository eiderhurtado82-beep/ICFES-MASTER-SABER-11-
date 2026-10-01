import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { Calendar, BookOpen, AlertTriangle, CheckCircle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

interface StudyPlanViewProps {
  onNavigateToPractice?: (target?: string) => void;
  onNavigateToMistakes?: () => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  onNavigateToPractice,
  onNavigateToMistakes,
}) => {
  const { profile: appProfile, setCurrentView, startPractice } = useApp();
  const [profile, setProfile] = useState<any>(null);
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback de navegación si no se proveen como props
  const handlePracticeNavigation = (target?: string) => {
    if (onNavigateToPractice) {
      onNavigateToPractice(target);
      return;
    }
    if (target === 'lectura_critica') {
      startPractice({ type: 'normal', area: 'LECTURA_CRITICA' });
    } else if (target === 'matematicas') {
      startPractice({ type: 'normal', area: 'MATEMATICAS' });
    } else if (target === 'ciencias_naturales') {
      startPractice({ type: 'normal', area: 'CIENCIAS_NATURALES' });
    } else if (target === 'sociales') {
      startPractice({ type: 'normal', area: 'SOCIALES_CIUDADANAS' });
    } else if (target === 'ingles') {
      startPractice({ type: 'normal', area: 'INGLES' });
    } else {
      startPractice({ type: 'normal' });
    }
  };

  const handleMistakesNavigation = () => {
    if (onNavigateToMistakes) {
      onNavigateToMistakes();
    } else {
      setCurrentView('mistakes');
    }
  };

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // 1. Cargar el nivel actual del estudiante desde profiles
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileData) setProfile(profileData);

          // 2. Analizar el Banco de Errores para detectar debilidades
          const { data: mistakesData } = await supabase
            .from('user_mistakes')
            .select('subject')
            .eq('user_id', session.user.id)
            .eq('is_resolved', false);

          if (mistakesData && mistakesData.length > 0) {
            // Contar errores por materia para encontrar las más críticas
            const subjectCounts = mistakesData.reduce<Record<string, number>>((acc, curr) => {
              if (curr.subject) {
                acc[curr.subject] = (acc[curr.subject] || 0) + 1;
              }
              return acc;
            }, {});

            // Ordenar materias de mayor a menor cantidad de errores
            const sortedWeaknesses = Object.keys(subjectCounts).sort(
              (a, b) => subjectCounts[b] - subjectCounts[a]
            );

            setWeakSubjects(sortedWeaknesses);
          }
        }

        // Si no hay datos remotos aún, sincronizar con el perfil local de contexto
        if (!profile && appProfile) {
          setProfile({
            level: appProfile.level,
            xp: appProfile.xp,
            full_name: appProfile.name,
          });

          if (appProfile.mistakes && appProfile.mistakes.length > 0) {
            const pendingMistakes = appProfile.mistakes.filter((m) => m.status === 'pending');
            const localCounts = pendingMistakes.reduce<Record<string, number>>((acc, curr) => {
              const subj = curr.area || curr.tema || 'GENERAL';
              acc[subj] = (acc[subj] || 0) + 1;
              return acc;
            }, {});
            const sortedLocal = Object.keys(localCounts).sort(
              (a, b) => localCounts[b] - localCounts[a]
            );
            if (sortedLocal.length > 0) {
              setWeakSubjects(sortedLocal);
            }
          }
        }
      } catch (error) {
        console.error('Error cargando plan de estudio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudyData();
  }, [appProfile]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-white flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <p className="text-sm font-medium text-slate-300">Diseñando tu currículo personalizado...</p>
      </div>
    );
  }

  // Lógica del plan: Si hay debilidades, la prioridad es repasarlas.
  // Si no, se asigna un simulacro global o avance de nivel.
  const priorityModule =
    weakSubjects.length > 0
      ? {
          type: 'repaso',
          title: `Refuerzo de ${weakSubjects[0].replace(/_/g, ' ')}`,
          description: 'Hemos detectado que tienes conceptos por consolidar en esta área.',
          actionText: 'Ir al Banco de Errores',
          action: handleMistakesNavigation,
          icon: <AlertTriangle className="text-orange-400" size={24} />,
        }
      : {
          type: 'avance',
          title: 'Simulacro Global de Nivelación',
          description: '¡Vas muy bien! Es momento de poner a prueba todas las competencias juntas.',
          actionText: 'Iniciar Simulacro',
          action: () => handlePracticeNavigation('simulacro_global'),
          icon: <CheckCircle className="text-emerald-400" size={24} />,
        };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto text-white space-y-8">
      <header className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 mb-2">
          <Calendar className="text-blue-500" size={32} />
          Tu Ruta de Aprendizaje
        </h2>
        <p className="text-slate-400 text-sm">
          Plan estructurado en base a tu rendimiento. Nivel actual:{' '}
          <span className="font-bold text-blue-400">{profile?.level || appProfile?.level || 1}</span>
        </p>
      </header>

      {/* Módulo Prioritario (Dinámico según los errores) */}
      <section className="mb-10">
        <h3 className="text-xl font-bold mb-4 text-slate-300">Prioridad para Hoy</h3>
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-900/20">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 shrink-0">
              {priorityModule.icon}
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-white capitalize">
                {priorityModule.title}
              </h4>
              <p className="text-slate-400 text-sm mt-1">{priorityModule.description}</p>
            </div>
          </div>
          <button
            onClick={priorityModule.action}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0 active:scale-95 text-sm"
          >
            {priorityModule.actionText}
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Cronograma Curricular Sugerido */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-slate-300">Próximos Módulos Sugeridos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <BookOpen className="text-blue-400" size={20} />
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-700 rounded-lg text-slate-300">
                Módulo 1
              </span>
            </div>
            <h4 className="font-bold text-base mb-1 text-white">Lectura Crítica: Textos Filosóficos</h4>
            <p className="text-sm text-slate-400 mb-4">
              Desarrollo de competencias interpretativas, argumentativas e identificación de premisas.
            </p>
            <button
              onClick={() => handlePracticeNavigation('lectura_critica')}
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 cursor-pointer"
            >
              Comenzar módulo <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <BookOpen className="text-emerald-400" size={20} />
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-700 rounded-lg text-slate-300">
                Módulo 2
              </span>
            </div>
            <h4 className="font-bold text-base mb-1 text-white">Matemáticas: Estadística y Probabilidad</h4>
            <p className="text-sm text-slate-400 mb-4">
              Análisis de gráficas, dispersión y resolución de problemas de aleatoriedad y conteo.
            </p>
            <button
              onClick={() => handlePracticeNavigation('matematicas')}
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 cursor-pointer"
            >
              Comenzar módulo <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <BookOpen className="text-amber-400" size={20} />
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-700 rounded-lg text-slate-300">
                Módulo 3
              </span>
            </div>
            <h4 className="font-bold text-base mb-1 text-white">Ciencias Naturales: Indagación y Leyes Físicas</h4>
            <p className="text-sm text-slate-400 mb-4">
              Modelos de conservación, termodinámica y diseño de experimentos científicos.
            </p>
            <button
              onClick={() => handlePracticeNavigation('ciencias_naturales')}
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 cursor-pointer"
            >
              Comenzar módulo <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <BookOpen className="text-purple-400" size={20} />
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-700 rounded-lg text-slate-300">
                Módulo 4
              </span>
            </div>
            <h4 className="font-bold text-base mb-1 text-white">Sociales y Ciudadanas: Constitución y Multiperspectivismo</h4>
            <p className="text-sm text-slate-400 mb-4">
              Mecanismos de participación, análisis de conflictos y derechos fundamentales.
            </p>
            <button
              onClick={() => handlePracticeNavigation('sociales')}
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 cursor-pointer"
            >
              Comenzar módulo <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <DisclaimerNotice />
    </div>
  );
};
