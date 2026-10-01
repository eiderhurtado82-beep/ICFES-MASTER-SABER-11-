import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LEARNING_TOPICS } from '../data/learningContent';
import { LearningTopic, SubjectArea } from '../types';
import { AREA_METADATA } from '../data/questions';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Play,
  RotateCcw,
  Clock,
  Bookmark,
  Share2,
  Bot,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const LearnView: React.FC = () => {
  const { startPractice, openTutorWithPrompt } = useApp();
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [filterArea, setFilterArea] = useState<SubjectArea | 'ALL'>('ALL');
  const [showSolution, setShowSolution] = useState(false);

  const filteredTopics = LEARNING_TOPICS.filter((t) => {
    if (filterArea === 'ALL') return true;
    return t.area === filterArea;
  });

  const areas: SubjectArea[] = [
    'MATEMATICAS',
    'LECTURA_CRITICA',
    'CIENCIAS_NATURALES',
    'SOCIALES_CIUDADANAS',
    'INGLES',
  ];

  // If a topic is selected, render the "Artículo Educativo" View
  if (selectedTopic) {
    const meta = AREA_METADATA[selectedTopic.area];
    const currentIndex = LEARNING_TOPICS.findIndex((t) => t.id === selectedTopic.id);
    const nextTopic = currentIndex < LEARNING_TOPICS.length - 1 ? LEARNING_TOPICS[currentIndex + 1] : null;
    const prevTopic = currentIndex > 0 ? LEARNING_TOPICS[currentIndex - 1] : null;

    const handlePracticeTopic = () => {
      startPractice({
        type: 'tema',
        area: selectedTopic.area,
        topic: selectedTopic.titulo,
      });
    };

    const handleAskTutorAboutTopic = () => {
      openTutorWithPrompt(
        null,
        `Hola Tutor ICFES, estoy leyendo el tema de "${selectedTopic.titulo}" en ${meta.name}. ¿Me podrías dar un ejemplo adicional o explicarme cómo suele preguntar esto el evaluador?`
      );
    };

    return (
      <div className="space-y-6 pb-16 animate-in fade-in duration-200">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <button
            onClick={() => setSelectedTopic(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo de Temas</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span>Aprende</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={meta.color}>{meta.shortName}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-xs">
              {selectedTopic.titulo}
            </span>
          </div>
        </div>

        {/* Article Container — Styled like a modern educational textbook chapter */}
        <article className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Article Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 space-y-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black ${meta.badgeBg}`}>
                {meta.name}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                <Clock className="w-3.5 h-3.5" /> 5 min de lectura
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              {selectedTopic.titulo}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium max-w-3xl leading-relaxed">
              {selectedTopic.subtitulo}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handlePracticeTopic}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Practicar este tema ahora</span>
              </button>

              <button
                onClick={handleAskTutorAboutTopic}
                className="px-4 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-emerald-600" />
                <span>Consultar Tutor sobre este tema</span>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8 max-w-3xl">
            {/* 1. Teoría Concisa y Digerible */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-black text-base uppercase tracking-wider">
                <Lightbulb className="w-5 h-5 text-indigo-600" />
                <h2>1. Teoría Fundamental y Razonamiento</h2>
              </div>

              <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed space-y-3 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                <p>{selectedTopic.resumenTeorico}</p>
              </div>
            </section>

            {/* 2. Reglas de Oro y Fórmulas */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-black text-base uppercase tracking-wider">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2>2. Reglas Clave y Fórmulas para el Examen</h2>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-2.5">
                <ul className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  {selectedTopic.clavesYFormulas.map((c, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 3. Ejemplo Resuelto Tipo ICFES */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-base uppercase tracking-wider">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h2>3. Ejemplo Resuelto Tipo Saber 11°</h2>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                    Situación / Contexto de Prueba:
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                    {selectedTopic.ejemploIcfes.enunciado}
                  </p>
                </div>

                {/* 4 Opciones A, B, C, D */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedTopic.ejemploIcfes.opciones.map((opc, opcIdx) => (
                    <div
                      key={opcIdx}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-2"
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center font-mono shrink-0">
                        {String.fromCharCode(65 + opcIdx)}
                      </span>
                      <span>{opc}</span>
                    </div>
                  ))}
                </div>

                {/* Toggle Solución Explicada */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>{showSolution ? 'Ocultar Solución Explicada' : 'Ver Solución Paso a Paso'}</span>
                  </button>

                  {showSolution && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-2.5 animate-in fade-in">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-extrabold text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Respuesta Correcta: {selectedTopic.ejemploIcfes.respuestaCorrecta}</span>
                      </div>

                      <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                        {selectedTopic.ejemploIcfes.solucionPasoAPaso.map((p, idx) => (
                          <p key={idx} className="leading-relaxed">
                            {p}
                          </p>
                        ))}
                      </div>

                      <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 text-[11px] text-emerald-900 dark:text-emerald-200 font-medium">
                        💡 <strong>¿Por qué?</strong> {selectedTopic.ejemploIcfes.porQue}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 4. Errores Frecuentes y Trampas del Evaluador */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-black text-base uppercase tracking-wider">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h2>4. Errores Frecuentes en el ICFES</h2>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/60 space-y-2">
                <ul className="space-y-1.5 pl-1 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  {selectedTopic.erroresComunes.map((err, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{err}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Bottom CTA Block */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-black text-lg">¿Listo para poner a prueba lo aprendido?</h3>
                <p className="text-xs text-emerald-100">
                  Resuelve una práctica de preguntas reales tipo ICFES sobre {selectedTopic.titulo}.
                </p>
              </div>

              <button
                onClick={handlePracticeTopic}
                className="shrink-0 px-6 py-3 rounded-xl bg-white text-emerald-900 font-black text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-emerald-900" />
                <span>Practicar este tema</span>
              </button>
            </div>

            {/* Next / Previous Topic Links */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
              {prevTopic ? (
                <button
                  onClick={() => {
                    setSelectedTopic(prevTopic);
                    setShowSolution(false);
                  }}
                  className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 font-bold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="truncate max-w-[150px]">{prevTopic.titulo}</span>
                </button>
              ) : (
                <div />
              )}

              {nextTopic && (
                <button
                  onClick={() => {
                    setSelectedTopic(nextTopic);
                    setShowSolution(false);
                  }}
                  className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 font-bold"
                >
                  <span className="truncate max-w-[150px]">{nextTopic.titulo}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </article>

        <DisclaimerNotice />
      </div>
    );
  }

  // Otherwise, render the Topic Catalog View
  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-indigo-950 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-emerald-300 border border-white/15">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Biblioteca Teórica Saber 11°</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black">
          Sección Aprende: Guías y Conceptos Clave
        </h2>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl leading-relaxed">
          Explicación pedagógica, fórmulas, ejemplos paso a paso tipo ICFES, errores frecuentes y trucos para razonar cada competencia oficial.
        </p>
      </div>

      {/* Filter by Area Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterArea('ALL')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            filterArea === 'ALL'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          Todas las Áreas ({LEARNING_TOPICS.length})
        </button>

        {areas.map((area) => {
          const meta = AREA_METADATA[area];
          const countInArea = LEARNING_TOPICS.filter((t) => t.area === area).length;

          return (
            <button
              key={area}
              onClick={() => setFilterArea(area)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterArea === area
                  ? `${meta.badgeBg} ring-2 ring-indigo-500 shadow-xs`
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{meta.shortName}</span>
              <span className="text-[10px] font-mono opacity-80">({countInArea})</span>
            </button>
          );
        })}
      </div>

      {/* Topics Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => {
          const meta = AREA_METADATA[topic.area];

          return (
            <div
              key={topic.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${meta.badgeBg}`}>
                    {meta.shortName}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> 5 min
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 leading-snug">
                  {topic.titulo}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {topic.subtitulo}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {topic.resumenTeorico}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ejemplo resuelto
                </span>

                <button
                  onClick={() => {
                    setSelectedTopic(topic);
                    setShowSolution(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Leer Artículo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <DisclaimerNotice />
    </div>
  );
};
