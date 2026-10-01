import React, { useState } from 'react';
import { Question } from '../types';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Compass,
  Sparkles,
  Bot,
  RefreshCw,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface ExplanationFeedbackProps {
  question: Question;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
}

export const ExplanationFeedback: React.FC<ExplanationFeedbackProps> = ({
  question,
  selectedAnswer,
}) => {
  const { setTutorSelectedQuestion, setIsTutorDrawerOpen, openTutorWithPrompt } = useApp();
  const [activeTab, setActiveTab] = useState<'porque' | 'aprende' | 'error' | 'consejo'>('porque');

  const isCorrect = selectedAnswer === question.respuestaCorrecta;

  const handleOpenTutor = () => {
    setTutorSelectedQuestion(question);
    setIsTutorDrawerOpen(true);
  };

  const handleExplainEasyWithTutor = () => {
    openTutorWithPrompt(
      question,
      `💡 Explícame esta pregunta de ${question.tema} de forma fácil, usando una analogía cotidiana de la vida real.`
    );
  };

  return (
    <div className="pt-2 animate-in fade-in duration-200 space-y-4">
      {/* 1. Status Alert Header */}
      <div
        className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-all ${
          isCorrect
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-100'
        }`}
      >
        <div className="flex items-center gap-3">
          {isCorrect ? (
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="font-extrabold text-sm sm:text-base tracking-tight">
              {isCorrect ? '¡Excelente deducción! Respuesta correcta' : 'Respuesta Incorrecta'}
            </div>
            <div className="text-xs opacity-90">
              Tu respuesta: <span className="font-bold underline">Opción {selectedAnswer}</span> | Respuesta correcta:{' '}
              <span className="font-bold underline text-emerald-700 dark:text-emerald-300">
                Opción {question.respuestaCorrecta}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Explícame Fácil (Abre Tutor con analogía) & Tutor IA */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={handleExplainEasyWithTutor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs shadow-xs bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer"
            title="Abrir Tutor con explicación por analogía"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>💡 Explícame fácil</span>
          </button>

          <button
            type="button"
            onClick={handleOpenTutor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Tutor ICFES</span>
          </button>
        </div>
      </div>

      {/* 3. 4-Tab Pedagogical System */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Sistema de Explicación Saber 11°
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
            Competencia: {question.competencia}
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-200/60 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('porque')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'porque'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>¿Por qué?</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('aprende')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'aprende'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Aprende esto</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('error')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'error'
                ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Error frecuente</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('consejo')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'consejo'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Consejo ICFES</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'porque' && (
            <div>
              <span className="font-bold text-indigo-700 dark:text-indigo-400 block mb-1">
                Justificación pedagógica paso a paso:
              </span>
              {question.explicacion.porQue}
            </div>
          )}
          {activeTab === 'aprende' && (
            <div>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                Concepto teórico indispensable:
              </span>
              {question.explicacion.aprendeEsto}
            </div>
          )}
          {activeTab === 'error' && (
            <div>
              <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">
                Trampa o confusión común en esta pregunta:
              </span>
              {question.explicacion.errorFrecuente}
            </div>
          )}
          {activeTab === 'consejo' && (
            <div>
              <span className="font-bold text-blue-700 dark:text-blue-400 block mb-1">
                Estrategia para el día del examen real:
              </span>
              {question.explicacion.consejoIcfes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
