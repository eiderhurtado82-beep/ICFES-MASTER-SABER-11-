import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useTutorAI } from '../hooks/useTutorAI';
import { AREA_METADATA } from '../data/questions';
import {
  Bot,
  X,
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  BookOpen,
  Trash2,
  User,
  ArrowRight,
} from 'lucide-react';

export const TutorDrawer: React.FC = () => {
  const {
    isTutorDrawerOpen,
    setIsTutorDrawerOpen,
    tutorSelectedQuestion,
    setTutorSelectedQuestion,
    tutorInitialPrompt,
    setTutorInitialPrompt,
  } = useApp();

  const { messages, isTyping, sendMessage, clearChat } = useTutorAI();
  const [inputPrompt, setInputPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive or when typing status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // If opened with an initial prompt (e.g. from "Explícame fácil"), trigger it automatically
  useEffect(() => {
    if (isTutorDrawerOpen && tutorInitialPrompt) {
      const promptToSend = tutorInitialPrompt;
      setTutorInitialPrompt(null);
      const isEasy =
        promptToSend.toLowerCase().includes('fácil') ||
        promptToSend.toLowerCase().includes('facil') ||
        promptToSend.toLowerCase().includes('analogía');

      sendMessage(promptToSend, tutorSelectedQuestion, isEasy);
    }
  }, [isTutorDrawerOpen, tutorInitialPrompt, tutorSelectedQuestion, sendMessage, setTutorInitialPrompt]);

  if (!isTutorDrawerOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isTyping) return;
    setInputPrompt('');
    sendMessage(text, tutorSelectedQuestion);
  };

  const handleExplainEasyDirect = () => {
    const easyPrompt = tutorSelectedQuestion
      ? `💡 Explícame esta pregunta de ${tutorSelectedQuestion.tema} de forma fácil, usando una analogía cotidiana de la vida real.`
      : '💡 Explícame cómo pensar como el evaluador del ICFES de forma fácil y con analogías.';
    sendMessage(easyPrompt, tutorSelectedQuestion, true);
  };

  const areaMeta = tutorSelectedQuestion ? AREA_METADATA[tutorSelectedQuestion.area] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[90vh] max-h-[750px] rounded-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header — Modern messaging app styling */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-emerald-700 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base tracking-tight">Tutor ICFES</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/20 text-white backdrop-blur-xs">
                  IA Socrática
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                {isTyping ? 'Escribiendo respuesta pedagógica...' : 'En línea • Guía paso a paso para Saber 11°'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Reiniciar chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsTutorDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="Cerrar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Context Banner (when discussing a specific question) */}
        {tutorSelectedQuestion && (
          <div className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between gap-3 text-xs">
            <div className="truncate text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              {areaMeta && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${areaMeta.badgeBg}`}>
                  {areaMeta.shortName}
                </span>
              )}
              <span className="font-extrabold">{tutorSelectedQuestion.tema}:</span>
              <span className="italic truncate text-slate-600 dark:text-slate-300">
                {tutorSelectedQuestion.pregunta}
              </span>
            </div>

            <button
              onClick={handleExplainEasyDirect}
              className="shrink-0 flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] shadow-xs transition-all cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 fill-current" />
              <span>Explícame fácil</span>
            </button>
          </div>
        )}

        {/* Chat History Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';

            return (
              <div
                key={m.id}
                className={`flex gap-3 items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-emerald-600 text-white shadow-2xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/60 dark:border-slate-700/60 shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {/* Easy Mode Explanation Structured Card */}
                  {m.easyCard && (
                    <div className="mt-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-slate-800 dark:text-slate-200 space-y-2.5 text-xs shadow-xs">
                      <div className="flex items-center justify-between border-b border-amber-100 dark:border-amber-900/60 pb-2">
                        <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400">
                          <Lightbulb className="w-4 h-4" />
                          <span>Analogía de la Vida Cotidiana:</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          Modo Principiante
                        </span>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 italic pl-1 leading-relaxed">
                        «{m.easyCard.analogia}»
                      </p>

                      <div className="font-extrabold text-slate-800 dark:text-slate-200 pt-1">
                        Pasos para Resolverla:
                      </div>
                      <ul className="space-y-1 pl-1">
                        {m.easyCard.pasos.map((paso, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{paso}</span>
                          </li>
                        ))}
                      </ul>

                      {m.easyCard.comparacion && (
                        <div className="pt-1 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                          <strong className="text-slate-700 dark:text-slate-200">
                            Regla de oro:{' '}
                          </strong>
                          {m.easyCard.comparacion}
                        </div>
                      )}

                      {m.easyCard.miniEjercicio && (
                        <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-900 dark:text-amber-200 font-medium text-[11px] border border-amber-200/60 dark:border-amber-800/60">
                          🎯 <strong>Mini reto para ti:</strong> {m.easyCard.miniEjercicio}
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1.5 text-right font-mono ${
                      isUser ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator with Bouncing Dots */}
          {isTyping && (
            <div className="flex gap-3 items-end">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl rounded-bl-xs px-4 py-3 flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-medium">
                  El Tutor está formulando tu pista pedagógica...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 font-bold shrink-0">
            Pistas rápidas:
          </span>
          <button
            onClick={() => handleSend('¿Cómo descarto las opciones incorrectas en esta pregunta?')}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 shrink-0 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            ¿Cómo descartar opciones?
          </button>
          <button
            onClick={() => handleSend('💡 Explícame fácil con una analogía cotidiana de la vida real')}
            className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 shrink-0 hover:bg-amber-100 transition-colors cursor-pointer font-semibold"
          >
            💡 Explícame con analogía
          </button>
          <button
            onClick={() => handleSend('¿Cuál es la trampa o distractor más frecuente en este tema?')}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 shrink-0 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            ¿Cuál es la trampa común?
          </button>
          <button
            onClick={() => handleSend('Dame el procedimiento paso a paso para resolver este problema')}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 shrink-0 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Procedimiento paso a paso
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta al Tutor (ej: ¿Por qué no puede ser la opción A?)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm sm:text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputPrompt.trim() || isTyping}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Preguntar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
