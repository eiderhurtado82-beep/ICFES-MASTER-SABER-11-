import React, { useState } from 'react';
import { Question } from '../types';
import { Flag, CheckCircle2, AlertCircle, HelpCircle, Filter } from 'lucide-react';

interface QuestionGridProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  flagged: Record<string, boolean>;
  onSelectQuestion: (index: number) => void;
  className?: string;
  compact?: boolean;
}

export const QuestionGrid: React.FC<QuestionGridProps> = ({
  questions,
  currentIndex,
  answers,
  flagged,
  onSelectQuestion,
  className = '',
  compact = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'flagged' | 'answered'>('all');

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const pendingCount = total - answeredCount;

  const filteredQuestionsWithIndex = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => {
      const hasAns = !!answers[q.id];
      const isFlg = !!flagged[q.id];

      if (filter === 'pending') return !hasAns;
      if (filter === 'flagged') return isFlg;
      if (filter === 'answered') return hasAns;
      return true;
    });

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Quick Summary Pill Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`p-2 rounded-xl text-left transition-all border ${
            filter === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <span className="block text-[10px] opacity-80 uppercase tracking-wider font-semibold">
            Total
          </span>
          <span className="font-mono font-black text-sm">{total} preg.</span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('answered')}
          className={`p-2 rounded-xl text-left transition-all border ${
            filter === 'answered'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800 hover:bg-indigo-100'
          }`}
        >
          <span className="block text-[10px] opacity-80 uppercase tracking-wider font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Respondidas
          </span>
          <span className="font-mono font-black text-sm">{answeredCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`p-2 rounded-xl text-left transition-all border ${
            filter === 'pending'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800 hover:bg-rose-100'
          }`}
        >
          <span className="block text-[10px] opacity-80 uppercase tracking-wider font-semibold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Pendientes
          </span>
          <span className="font-mono font-black text-sm">{pendingCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('flagged')}
          className={`p-2 rounded-xl text-left transition-all border ${
            filter === 'flagged'
              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800 hover:bg-amber-100'
          }`}
        >
          <span className="block text-[10px] opacity-80 uppercase tracking-wider font-semibold flex items-center gap-1">
            <Flag className="w-3 h-3 fill-current" />
            Marcadas
          </span>
          <span className="font-mono font-black text-sm">{flaggedCount}</span>
        </button>
      </div>

      {/* Grid of Questions */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
          <span>Toca una pregunta para ir directamente a ella:</span>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Ver todas ({total})
            </button>
          )}
        </div>

        <div
          className={`grid ${
            compact ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8'
          } gap-2 p-1 max-h-64 overflow-y-auto`}
        >
          {filteredQuestionsWithIndex.length === 0 ? (
            <div className="col-span-full py-6 text-center text-xs text-slate-400 italic">
              No hay preguntas con este filtro ({filter}).
            </div>
          ) : (
            filteredQuestionsWithIndex.map(({ q, idx }) => {
              const hasAns = !!answers[q.id];
              const isFlg = !!flagged[q.id];
              const isCurr = idx === currentIndex;
              const chosenOption = answers[q.id];

              let stateClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

              if (hasAns) {
                stateClasses = 'bg-indigo-600 text-white border-indigo-600 shadow-xs';
              }
              if (isFlg) {
                stateClasses = 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-300 shadow-xs';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onSelectQuestion(idx)}
                  className={`relative h-12 rounded-xl font-bold text-xs flex flex-col items-center justify-center border transition-all cursor-pointer ${stateClasses} ${
                    isCurr
                      ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900 scale-105 z-10 font-black'
                      : 'hover:opacity-90 active:scale-95'
                  }`}
                  title={`Pregunta ${idx + 1}: ${
                    isFlg ? 'Marcada para revisar' : hasAns ? `Respondida (${chosenOption})` : 'Pendiente'
                  }`}
                >
                  {/* Flag indicator top right */}
                  {isFlg && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                      <Flag className="w-2.5 h-2.5 fill-current" />
                    </span>
                  )}

                  <span className="text-[11px] leading-none">#{idx + 1}</span>

                  <span className="text-[10px] font-mono mt-0.5 font-bold">
                    {hasAns ? chosenOption : '—'}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Visual Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-md bg-indigo-600 inline-block" />
          Respondida
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-md bg-amber-500 inline-block" />
          Marcada para revisar
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-md bg-slate-300 dark:bg-slate-700 inline-block" />
          Sin responder
        </span>
      </div>
    </div>
  );
};
