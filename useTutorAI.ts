import { useState, useCallback } from 'react';
import { Question, EasyExplanation } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: number;
  easyCard?: EasyExplanation;
}

export function useTutorAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'tutor',
      text: '¡Hola! Soy tu **Tutor ICFES**. Mi labor es enseñarte a pensar como el evaluador de las Pruebas Saber 11°: deducir conceptos, eliminar distractores y estructurar tu razonamiento paso a paso sin darte la respuesta directa.\n\n¿En qué pregunta o concepto te gustaría que trabajemos juntos?',
      timestamp: Date.now(),
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  /**
   * Generates a pedagogical mock response simulating Gemini 2.5 Flash / SDK
   */
  const generatePedagogicalResponse = (
    prompt: string,
    questionContext?: Question | null,
    isEasyMode = false
  ): { reply: string; easyCard?: EasyExplanation } => {
    const lowerPrompt = prompt.toLowerCase();

    // 1. Easy mode requested or analogies
    if (
      isEasyMode ||
      lowerPrompt.includes('fácil') ||
      lowerPrompt.includes('facil') ||
      lowerPrompt.includes('analogía') ||
      lowerPrompt.includes('analogia') ||
      lowerPrompt.includes('principiante')
    ) {
      if (questionContext) {
        // Context-aware analogy
        let analogyText = `Imagina que vas a una panadería o tienda de barrio. En esta pregunta sobre **${questionContext.tema}**, el evaluador no quiere que memorices un cálculo abstracto, sino que entiendas la relación de causa y efecto.`;
        if (questionContext.area === 'MATEMATICAS') {
          analogyText = `Imagina que compras unas zapatillas de $100.000 con un 20% de descuento. Pagas $80.000. Si luego te dan otro 10% adicional, se aplica sobre los $80.000 (te descuentan $8.000), no sobre los $100.000 iniciales. ¡Esa es exactamente la trampa que el ICFES puso en esta pregunta!`;
        } else if (questionContext.area === 'LECTURA_CRITICA') {
          analogyText = `Es como cuando un amigo te cuenta un chisme largo con mil detalles (esos son los argumentos o ejemplos), pero al final lo que realmente te quiere decir en una sola frase es: «no confíes en esa persona» (esa es la tesis central). No te quedes en el chisme accesorio; busca la conclusión.`;
        } else if (questionContext.area === 'CIENCIAS_NATURALES') {
          analogyText = `Es como cocinar un arroz: si cambias la cantidad de sal a propósito para ver cómo queda el sabor, la sal es tu variable independiente, el sabor medido es la variable dependiente, y la cantidad de agua y el fuego deben ser idénticos (variables controladas) para que la comparación sea justa.`;
        } else if (questionContext.area === 'SOCIALES_CIUDADANAS') {
          analogyText = `Es como el árbitro en un partido de fútbol: si un delantero comete una falta evidente contra los derechos del arquero, el árbitro saca la tarjeta roja inmediata para proteger el juego limpio. La Acción de Tutela funciona igual: protege de urgencia un derecho fundamental que está siendo vulnerado.`;
        } else if (questionContext.area === 'INGLES') {
          analogyText = `Piensa en cuando miras un letrero en el aeropuerto o en una estación de tren: no necesitas traducir cada una de las palabras en tu cabeza; basta con identificar el lugar («Airport/Station») y la acción («Wait here», «Boarding») para saber la respuesta correcta.`;
        }

        return {
          reply: `¡Excelente iniciativa! Vamos a desarmar esta pregunta de **${questionContext.tema}** con una explicación intuitiva y sin lenguaje rebuscado:`,
          easyCard: {
            analogia: analogyText,
            pasos: [
              'Paso 1: Ve directo a la última frase del enunciado para saber qué te exigen resolver exactamente.',
              'Paso 2: Separa los datos esenciales y tacha la información decorativa o anecdótica.',
              'Paso 3: Descarta de inmediato las dos opciones absurdas o extremas.',
              'Paso 4: Comprueba que la opción final responda la pregunta formulada y no una idea secundaria.',
            ],
            comparacion:
              'El ICFES no mide cuántas fórmulas te aprendiste de memoria, sino tu capacidad de razonar lógicamente ante situaciones de la vida real.',
            miniEjercicio:
              'Antes de marcar: ¿Si tuvieras que explicarle esta pregunta en 15 segundos a un compañero de 9° grado, qué palabra clave le dirías que busque primero?',
          },
        };
      }

      // General easy explanation
      return {
        reply:
          '¡Con gusto! En el modo fácil desarmamos cualquier concepto complejo con situaciones de la vida diaria en Colombia. Dime sobre qué materia o pregunta tienes curiosidad y te la explico con una analogía clara.',
      };
    }

    // 2. Discard options / eliminate distractors
    if (
      lowerPrompt.includes('descartar') ||
      lowerPrompt.includes('distractor') ||
      lowerPrompt.includes('opciones')
    ) {
      if (questionContext) {
        return {
          reply: `Para descartar opciones en esta pregunta de **${questionContext.tema}**:\n\n1. **Identifica el extremo opuesto:** En las 4 opciones siempre hay una que afirma lo contrario a las leyes lógicas o al texto. Esa se descarta primero.\n2. **Detecta la verdad a medias:** Otra opción dice algo que es científicamente o históricamente cierto, pero que **no responde lo que la pregunta pide**.\n3. **El dilema de las dos finalistas:** Entre las dos restantes, una suele contener una trampa de generalización («siempre», «nunca», «únicamente»). La opción correcta suele ser moderada y matemáticamente exacta.\n\n¿Cuál de las opciones crees que podemos tachar de inmediato en este ejercicio?`,
        };
      }
      return {
        reply:
          'El método de descarte del ICFES consiste en:\n• Tachar la opción contradictoria (opuesta al texto).\n• Tachar la opción verdadera pero irrelevante (no responde la pregunta formulada).\n• Comparar las 2 finalistas identificando palabras absolutas como "siempre", "jamás" o "únicamente" que suelen ser trampas.',
      };
    }

    // 3. Traps / Common mistakes
    if (
      lowerPrompt.includes('trampa') ||
      lowerPrompt.includes('error') ||
      lowerPrompt.includes('frecuente') ||
      lowerPrompt.includes('comun')
    ) {
      if (questionContext && questionContext.explicacion?.errorFrecuente) {
        return {
          reply: `⚠️ **Trampa clásica del evaluador en este tema (${questionContext.tema}):**\n\n${questionContext.explicacion.errorFrecuente}\n\n💡 **Consejo del Tutor:** ${questionContext.explicacion.consejoIcfes || 'Presta especial atención a la redacción de la pregunta antes de calcular o asumir conclusiones rápidas.'}`,
        };
      }
      return {
        reply:
          'En el Saber 11°, las 3 trampas más frecuentes son:\n1. **Lectura superficial:** Asumir que la primera frase del texto es la conclusión, cuando en realidad es la premisa a refutar.\n2. **Operaciones directas:** En matemáticas, sumar porcentajes sucesivos en vez de multiplicar factores.\n3. **Prejuicio personal:** En sociales y ciudadanas, marcar lo que tú harías en la vida real en vez de lo que la Constitución colombiana dicta normativamente.',
      };
    }

    // 4. Formula / Step-by-step
    if (
      lowerPrompt.includes('fórmula') ||
      lowerPrompt.includes('formula') ||
      lowerPrompt.includes('paso a paso') ||
      lowerPrompt.includes('procedimiento')
    ) {
      if (questionContext) {
        return {
          reply: `Vamos paso a paso con **${questionContext.tema}**:\n\n• **Paso 1 (Lectura de variables):** ${(questionContext.contexto || questionContext.pregunta).slice(0, 140)}...\n• **Paso 2 (Planteamiento):** Traduce las condiciones del problema a una relación matemática o deductiva.\n• **Paso 3 (Validación):** ${questionContext.explicacion?.porQue || 'Compara las opciones con el resultado obtenido.'}\n\n¿En qué paso te sientes inseguro para guiarte sin darte la respuesta directa?`,
        };
      }
      return {
        reply:
          'El método de 3 pasos para cualquier problema cuantitativo:\n1. Anota los datos conocidos y la incógnita solicitada.\n2. Escribe la relación o fórmula fundamental antes de reemplazar números.\n3. Simplifica y verifica el orden de magnitud del resultado antes de marcar.',
      };
    }

    // 5. Default Socratic guidance for question context
    if (questionContext) {
      return {
        reply: `Analicemos juntos esta pregunta de **${questionContext.area}** (${questionContext.tema}):\n\n📌 **Competencia en juego:** ${questionContext.competencia || 'Razonamiento y aplicación'}\n\nObserva bien el enunciado: «*${questionContext.pregunta}*».\n\nEn vez de darte la clave correcta de inmediato, dime: ¿cuál de las 4 opciones te parece la más sospechosa o fácil de descartar y por qué?`,
      };
    }

    // General query response
    return {
      reply: `Comprendo tu consulta. En la prueba Saber 11°, la clave para obtener más de 400 puntos no es memorizar respuestas, sino entrenar el **pensamiento crítico**:\n\n• Si es **Matemáticas**: busca la proporción o factor multiplicativo.\n• Si es **Lectura Crítica**: identifica la intención y tesis del autor.\n• Si es **Ciencias**: distingue la causa (independiente) del efecto (dependiente).\n• Si es **Sociales**: fundamenta en la Constitución de 1991 y el pluralismo.\n• Si es **Inglés**: básate en el contexto y la función comunicativa.\n\n¿Quieres que practiquemos con un ejemplo específico?`,
    };
  };

  /**
   * Send a message to the Tutor AI, simulating typing latency and pedagogical response
   */
  const sendMessage = useCallback(
    async (
      userText: string,
      questionContext?: Question | null,
      isEasyMode = false
    ) => {
      const trimmed = userText.trim();
      if (!trimmed || isTyping) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: trimmed,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      // Simulate realistic AI generation latency (600ms - 1000ms)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const { reply, easyCard } = generatePedagogicalResponse(
        trimmed,
        questionContext,
        isEasyMode
      );

      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: reply,
        timestamp: Date.now(),
        easyCard,
      };

      setMessages((prev) => [...prev, tutorMsg]);
      setIsTyping(false);
    },
    [isTyping]
  );

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'tutor',
        text: '¡Conversación reiniciada! Estoy listo para resolver tus dudas de preparación Saber 11°. ¿Qué tema o pregunta quieres analizar?',
        timestamp: Date.now(),
      },
    ]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
  };
}
