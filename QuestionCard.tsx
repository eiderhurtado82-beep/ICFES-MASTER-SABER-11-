import React from 'react';
import { Question } from '../types';
import { AREA_METADATA } from '../data/questions';
import { useApp } from '../context/AppContext';
import { ExplanationFeedback } from './ExplanationFeedback';
import { CheckCircle2, XCircle, Flag } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D';
  onSelectAnswer?: (option: 'A' | 'B' | 'C' | 'D') => void;
  showExplanation?: boolean; // In practice mode, shows immediately after answer
  mode?: 'practice' | 'practice_pending' | 'exam' | 'review';
  questionNumber?: number;
  totalQuestions?: number;
  isFlagged?: boolean;
  onToggleFlag?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  showExplanation = false,
  mode = 'practice',
  questionNumber,
  totalQuestions,
  isFlagged = false,
  onToggleFlag,
}) => {
  const { accessibility } = useApp();
  const meta = AREA_METADATA[question.area];

  const fontSizeClass =
    accessibility.fontSize === 'large'
      ? 'text-base leading-relaxed'
      : accessibility.fontSize === 'xlarge'
      ? 'text-lg leading-loose'
      : 'text-sm leading-normal';

  const titleSizeClass =
    accessibility.fontSize === 'large'
      ? 'text-lg'
      : accessibility.fontSize === 'xlarge'
      ? 'text-xl'
      : 'text-base';

  const letters: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === question.respuestaCorrecta;

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl shadow-sm border transition-all ${
        accessibility.highContrast
          ? 'border-slate-800 dark:border-white ring-1 ring-slate-800'
          : 'border-slate-200/90 dark:border-slate-800'
      } overflow-hidden`}
    >
      {/* Question Header Meta */}
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {questionNumber !== undefined && (
            <span className="font-extrabold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 shadow-2xs">
              Pregunta {questionNumber} {totalQuestions ? `de ${totalQuestions}` : ''}
            </span>
          )}
          <span
            className={`px-2.5 py-1 rounded-lg font-bold ${meta.badgeBg}`}
          >
            {meta.shortName}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
            {question.competencia}
          </span>
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
              question.dificultad === 'Básica'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : question.dificultad === 'Intermedia'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}
          >
            {question.dificultad}
          </span>
        </div>

        {/* Flag button in Exam mode */}
        {mode === 'exam' && onToggleFlag && (
          <button
            onClick={onToggleFlag}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              isFlagged
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
            title="Marcar pregunta para revisar después"
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-white' : ''}`} />
            <span>{isFlagged ? 'Marcada' : 'Marcar para revisar'}</span>
          </button>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Context / Stimulus Text / Situation */}
        {question.contexto && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span>Contexto / Situación de estudio:</span>
            </div>
            <div className={`${fontSizeClass} whitespace-pre-line leading-relaxed font-sans`}>
              {question.contexto}
            </div>
          </div>
        )}

        {/* Question Statement */}
        <div className={`font-bold text-slate-900 dark:text-slate-100 ${titleSizeClass}`}>
          {question.pregunta}
        </div>

        {/* 4 Options (A, B, C, D) */}
        <div className="space-y-3">
          {question.opciones.map((opcionTexto, index) => {
            const letter = letters[index];
            const isSelected = selectedAnswer === letter;
            const isCorrectOption = question.respuestaCorrecta === letter;

            let optionStyle =
              'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-800/60 text-slate-800 dark:text-slate-200';
            let badgeStyle =
              'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';

            if (mode === 'exam') {
              if (isSelected) {
                optionStyle =
                  'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20';
                badgeStyle = 'bg-indigo-600 text-white border-indigo-600';
              }
            } else if (showExplanation && isAnswered) {
              // Practice mode with feedback
              if (isCorrectOption) {
                optionStyle =
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30 font-medium';
                badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isSelected && !isCorrectOption) {
                optionStyle =
                  'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/30';
                badgeStyle = 'bg-rose-600 text-white border-rose-600';
              } else {
                optionStyle = 'opacity-60 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40';
              }
            } else if (isSelected) {
              optionStyle =
                'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20';
              badgeStyle = 'bg-indigo-600 text-white border-indigo-600';
            }

            return (
              <button
                key={letter}
                type="button"
                disabled={mode !== 'exam' && showExplanation && isAnswered}
                onClick={() => onSelectAnswer && onSelectAnswer(letter)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3.5 group cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <div
                  className={`w-7 h-7 shrink-0 rounded-xl border flex items-center justify-center font-bold text-xs shadow-2xs transition-all ${badgeStyle}`}
                >
                  {letter}
                </div>
                <div className={`flex-1 ${fontSizeClass} pt-0.5 leading-relaxed`}>
                  {opcionTexto}
                </div>
                {showExplanation && isAnswered && (
                  <div className="shrink-0 pt-0.5">
                    {isCorrectOption ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-900" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-600 fill-rose-100 dark:fill-rose-900" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Pedagogical Explanations (Practice Mode or Review Mode) */}
        {showExplanation && isAnswered && (
          <ExplanationFeedback
            question={question}
            selectedAnswer={selectedAnswer!}
          />
        )}
      </div>
    </div>
  );
};
