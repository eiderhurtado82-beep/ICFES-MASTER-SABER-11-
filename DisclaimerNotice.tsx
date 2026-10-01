import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerNotice: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center py-2 px-3 bg-slate-100/80 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 leading-tight">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Aviso legal: </span>
        Esta aplicación es una herramienta educativa independiente para preparación académica. No está afiliada, patrocinada ni respaldada oficialmente por el ICFES.
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 rounded-xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed shadow-xs">
      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-amber-950 dark:text-amber-100">
          Herramienta Educativa Independiente
        </p>
        <p className="mt-0.5 text-amber-800/90 dark:text-amber-300/80">
          Esta aplicación es una herramienta educativa independiente para preparación académica. No está afiliada, patrocinada ni respaldada oficialmente por el ICFES. Las preguntas son pedagógicas y de autoría propia inspiradas en las competencias públicas de Saber 11°.
        </p>
      </div>
    </div>
  );
};
