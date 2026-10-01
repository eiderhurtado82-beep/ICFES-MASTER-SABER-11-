import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubjectArea } from '../types';
import { AREA_METADATA, INITIAL_QUESTIONS } from '../data/questions';
import {
  Zap,
  Layers,
  Flame,
  Filter,
  AlertTriangle,
  BrainCircuit,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const PracticeSelectView: React.FC = () => {
  const { startPractice, profile, setCurrentView } = useApp();
  const [selectedArea, setSelectedArea] = useState<SubjectArea | 'ALL'>('ALL');

  if (!profile) return null;

  const pendingErrorsCount = profile.mistakes.filter(
    (m) => m.status === 'pending'
  ).length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <span>Modo Práctica Saber 11°</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Entrena a tu ritmo con retroalimentación pedagógica inmediata tras cada respuesta.
        </p>
      </div>

      {/* Main Practice Modes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Práctica Rápida (5 preguntas) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Práctica Rápida
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong>5 preguntas</strong> seleccionadas. Ideal para repasos veloces en descansos de 5 a 10 minutos.
            </p>
          </div>
          <button
            onClick={() =>
              startPractice({
                type: 'rapida',
                area: selectedArea === 'ALL' ? undefined : selectedArea,
              })
            }
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Iniciar (5 Preguntas)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Práctica Normal (10 preguntas) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Práctica Normal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong>10 preguntas</strong> con dificultad progresiva para consolidar tu método deductivo.
            </p>
          </div>
          <button
            onClick={() =>
              startPractice({
                type: 'normal',
                area: selectedArea === 'ALL' ? undefined : selectedArea,
              })
            }
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Iniciar (10 Preguntas)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Práctica Intensiva (20 preguntas) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Práctica Intensiva
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong>20 preguntas</strong> para medir resistencia mental, manejo de cansancio y ritmo de lectura.
            </p>
          </div>
          <button
            onClick={() =>
              startPractice({
                type: 'intensiva',
                area: selectedArea === 'ALL' ? undefined : selectedArea,
              })
            }
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Iniciar (20 Preguntas)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Práctica de Errores */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold relative">
              <AlertTriangle className="w-5 h-5" />
              {pendingErrorsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingErrorsCount}
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              Práctica de Errores
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Entrena exclusivamente las preguntas y temas en los que has fallado anteriormente hasta dominarlos.
            </p>
          </div>
          <button
            onClick={() =>
              startPractice({
                type: 'errores',
              })
            }
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Entrenar Errores ({pendingErrorsCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Práctica Inteligente (Adaptativa) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 sm:col-span-2">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 text-purple-200 flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base text-white">
                Práctica Inteligente (Algoritmo Adaptativo)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/40 text-[10px] font-bold">
                Recomendada
              </span>
            </div>
            <p className="text-xs text-purple-200">
              El algoritmo analiza tu porcentaje de aciertos, detecta qué competencias te cuestan más trabajo (ej. Álgebra, Filosofía o Estequiometría) y calibra la dificultad en tiempo real.
            </p>
          </div>
          <button
            onClick={() =>
              startPractice({
                type: 'inteligente',
              })
            }
            className="py-3 px-6 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all w-max"
          >
            <span>Iniciar Práctica Adaptativa</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Práctica por Tema / Área */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span>Práctica por Área Específica</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selecciona una de las 5 materias oficiales para concentrar tu entrenamiento:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {(
            [
              'MATEMATICAS',
              'LECTURA_CRITICA',
              'CIENCIAS_NATURALES',
              'SOCIALES_CIUDADANAS',
              'INGLES',
            ] as SubjectArea[]
          ).map((area) => {
            const meta = AREA_METADATA[area];
            const qCount = INITIAL_QUESTIONS.filter((q) => q.area === area).length;

            return (
              <button
                key={area}
                onClick={() =>
                  startPractice({
                    type: 'tema',
                    area: area,
                  })
                }
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-sm text-left transition-all space-y-1 group"
              >
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${meta.badgeBg}`}>
                  {meta.shortName}
                </span>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                  {meta.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {qCount} preguntas disponibles
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <DisclaimerNotice compact />
    </div>
  );
};
