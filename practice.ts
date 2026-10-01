import { supabase } from './supabase';

/**
 * Lógica de evaluación y guardado en lote en el Banco de Errores al terminar el examen
 */
export const evaluateAndSaveMistakes = async (
  sessionUserId: string,
  answers: Record<string, any>,
  questionsData: any[]
) => {
  try {
    const mistakesToInsert: any[] = [];

    questionsData.forEach((question) => {
      const userAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer || question.respuestaCorrecta;
      const questionSubject = question.subject || question.area || 'GENERAL';
      const questionText = question.text || question.pregunta || '';

      let explanation = question.explanation;
      if (!explanation && question.explicacion) {
        explanation =
          typeof question.explicacion === 'string'
            ? question.explicacion
            : question.explicacion.porQue
            ? `${question.explicacion.porQue} | ${question.explicacion.aprendeEsto || ''}`
            : '';
      }

      if (userAnswer && userAnswer !== correctAnswer) {
        mistakesToInsert.push({
          user_id: sessionUserId,
          question_id: question.id,
          subject: questionSubject,
          question_text: questionText,
          user_answer: userAnswer,
          correct_answer: correctAnswer,
          ai_explanation: explanation || 'Revisa la competencia y el tema asociado para dominar esta pregunta.',
          is_resolved: false,
        });
      }
    });

    if (mistakesToInsert.length > 0) {
      const { error } = await supabase.from('user_mistakes').insert(mistakesToInsert);
      if (error) {
        console.warn('Nota al guardar errores en lote:', error.message);
      }
    }
  } catch (err) {
    console.error('Error en evaluateAndSaveMistakes:', err);
  }
};

/**
 * Finaliza un simulacro o sesión de práctica:
 * 1. Marcar el simulacro como completado en Supabase
 * 2. Sumar XP al perfil (Intenta RPC primero para evitar condiciones de carrera si abre dos pestañas, o fallback directo)
 */
export const finishPractice = async (
  sessionId: string,
  earnedXP: number,
  optionalData?: {
    answers?: Record<string, any>;
    timeElapsed?: number;
  }
) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    // 1. Marcar el simulacro como completado
    const updatePayload: Record<string, any> = {
      status: 'completed',
      updated_at: new Date().toISOString(),
    };
    if (optionalData?.answers) {
      updatePayload.answers = optionalData.answers;
    }
    if (optionalData?.timeElapsed !== undefined) {
      updatePayload.time_elapsed = optionalData.timeElapsed;
    }

    await supabase
      .from('practice_sessions')
      .update(updatePayload)
      .eq('id', sessionId);

    if (!session?.user?.id || earnedXP <= 0) return;

    // 2. Sumar XP al perfil usando RPC para evitar condiciones de carrera
    const { error: rpcError } = await supabase.rpc('increment_profile_xp', {
      user_id: session.user.id,
      xp_to_add: earnedXP,
    });

    // Fallback: Si no existe el RPC o da error, actualizar directo
    if (rpcError) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        const currentXP = profile.xp || 0;
        const newXP = currentXP + earnedXP;
        const newLevel = Math.max(1, Math.floor(Math.sqrt(newXP / 40)) + 1);

        await supabase
          .from('profiles')
          .update({
            xp: newXP,
            level: newLevel,
            last_study_date: new Date().toISOString().split('T')[0],
          })
          .eq('id', session.user.id);
      }
    }
  } catch (error) {
    console.error('Error al finalizar práctica en Supabase:', error);
  }
};
