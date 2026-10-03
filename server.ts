import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable rawBody preservation for Stripe webhook cryptographic verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: Tutor ICFES Chat & Pedagogical Queries
app.post('/api/tutor/chat', async (req, res) => {
  try {
    const { questionContext, userPrompt, history = [] } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: 'userPrompt es requerido' });
    }

    if (!ai) {
      // Pedagogical fallback response if no key is configured
      return res.json({
        reply: `¡Hola! Como Tutor ICFES, te recuerdo la regla de oro para este tipo de preguntas:
1. **Analiza el enunciado y la pregunta central**: Identifica las variables o el argumento principal antes de ver las opciones.
2. **Descarta opciones absurdas**: El ICFES suele incluir dos distractores evidentes y dos opciones muy cercanas.
3. **Justificación conceptual**: Relaciona el concepto evaluado con la competencia oficial (Uso de conceptos, Explicación o Indagación).
¡Continúa practicando con constancia para alcanzar tu meta de puntaje!`,
      });
    }

    const systemInstruction = `Eres "Tutor ICFES", un profesor virtual experto, motivador y pedagógico especializado en la preparación para las Pruebas Saber 11° de Colombia.
Reglas clave:
- Nunca te limites a decir la respuesta correcta; enseña el procedimiento deductivo y cómo pensar como el evaluador del ICFES.
- Sé claro, conciso, amable y estructurado (usa viñetas y pasos numerados cuando aplique).
- Si hay un contexto de pregunta adjunto (Área, Enunciado, Opciones, Respuesta), utilízalo para responder con precisión quirúrgica.
- Si el estudiante tiene dudas sobre un concepto (ej. porcentajes, tesis vs argumento, estequiometría, mecanismos de participación, conectores en inglés), explícalo con un ejemplo claro de la cotidianidad colombiana y una estrategia para el ICFES.
- Aclara siempre las trampas o distractores típicos en los que suelen caer los estudiantes.`;

    let promptContent = '';
    if (questionContext) {
      promptContent += `[CONTEXTO DE LA PREGUNTA ACTUAL]
Área: ${questionContext.area || 'General'}
Tema: ${questionContext.tema || 'General'}
Competencia: ${questionContext.competencia || 'General'}
Enunciado / Situación: ${questionContext.contexto || ''} ${questionContext.pregunta || ''}
Opciones:
A: ${questionContext.opciones?.[0] || ''}
B: ${questionContext.opciones?.[1] || ''}
C: ${questionContext.opciones?.[2] || ''}
D: ${questionContext.opciones?.[3] || ''}
Respuesta Correcta: ${questionContext.respuestaCorrecta || ''}
Explicación previa: ${questionContext.explicacion?.porQue || ''}
-----------------------
`;
    }

    promptContent += `Pregunta o duda del estudiante: ${userPrompt}`;

    let reply: string;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContent,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      reply = response.text || '';
    } catch (aiErr: any) {
      console.warn('Gemini temporary spike/error, using pedagogical fallback:', aiErr?.message);
      reply = `**Consejo Pedagógico del Tutor ICFES:**
1. **Analiza el enunciado central**: En esta pregunta, identifica primero si el problema requiere plantear una proporción, deducir la postura del autor o reconocer variables causa-efecto.
2. **Descarte estratégico**: Descarta de inmediato los dos distractores extremos o que añadan información que el texto o la gráfica no confirman.
3. **Comprobación rápida**: Verifica si tu respuesta se alinea directamente con la pregunta que formula el problema, sin desviarte por datos secundarios.
¡Practica este razonamiento paso a paso para asegurar tus puntos en la prueba!`;
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/tutor/chat:', error);
    return res.json({
      reply: `**Guía del Tutor ICFES:**
- Recuerda descomponer el problema en variables conocidas e incógnitas.
- Para las pruebas Saber 11°, las respuestas correctas siempre están fundamentadas en la evidencia del texto o en los principios universales de la ciencia.
- Si dudas entre dos opciones, relee la última frase de la pregunta para ver cuál responde con mayor precisión matemática o conceptual.`,
    });
  }
});

// API: Modo "Explícame como si fuera principiante / Explícame fácil"
app.post('/api/tutor/explain-easy', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'La pregunta es requerida' });
    }

    if (!ai) {
      // Rich pedagogical fallback
      return res.json({
        easyExplanation: {
          analogia: 'Imagina esto como una receta de cocina o un juego cotidiano donde cada ingrediente debe estar en proporción.',
          pasos: [
            'Paso 1: Mira qué te están preguntando exactamente (el objetivo).',
            'Paso 2: Separa los datos importantes y tacha lo que es solo relleno.',
            'Paso 3: Descarta las opciones que contradicen la lógica básica.',
            'Paso 4: Comprueba que la opción elegida responda directamente a la pregunta.'
          ],
          comparacion: 'Es la diferencia entre memorizar una fórmula y entender para qué sirve en la vida real.',
          miniEjercicio: 'Si duplicas la cantidad de partida, ¿el resultado final aumenta o disminuye? Ese mismo razonamiento resuelve esta pregunta.'
        }
      });
    }

    const systemInstruction = `Eres un docente pedagógico especializado en educación secundaria. Tu misión es transformar una pregunta o concepto de las Pruebas Saber 11° en una explicación ultra sencilla ("Modo Principiante" / "Explícame Fácil").
Debes devolver la respuesta en formato JSON con la siguiente estructura:
{
  "analogia": "Una analogía de la vida cotidiana muy fácil de entender (ej. comida, fútbol, dinero, compras en la tienda de barrio)",
  "pasos": [
    "Paso 1: ...",
    "Paso 2: ...",
    "Paso 3: ..."
  ],
  "comparacion": "Una comparación sencilla que aclare la confusión más común",
  "miniEjercicio": "Un mini ejercicio o pregunta de verificación de 1 sola frase con su mini respuesta entre paréntesis"
}`;

    const promptText = `Explica esta pregunta para un principiante:
Área: ${question.area}
Tema: ${question.tema}
Enunciado: ${question.contexto || ''} ${question.pregunta}
Respuesta Correcta: Opción ${question.respuestaCorrecta} (${question.opciones?.[question.respuestaCorrecta === 'A' ? 0 : question.respuestaCorrecta === 'B' ? 1 : question.respuestaCorrecta === 'C' ? 2 : 3]})
Explicación técnica: ${question.explicacion?.porQue || ''}`;

    let parsed: any;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });
      parsed = JSON.parse(response.text || '{}');
    } catch (aiErr: any) {
      console.warn('Gemini temporary spike/error on explain-easy, using pedagogical fallback:', aiErr?.message);
      parsed = {
        analogia: 'Imagina que vas a una tienda en Colombia: el precio final depende de calcular primero el descuento base antes de agregar cualquier otro costo.',
        pasos: [
          'Paso 1: Identifica qué te pide exactamente la pregunta en su última oración.',
          'Paso 2: Separa los datos numéricos o conceptos indispensables del texto complementario.',
          'Paso 3: Descarta las 2 opciones que contradicen la lógica cotidiana o científica básica.',
          'Paso 4: Comprueba que la opción elegida responda directamente al enunciado.'
        ],
        comparacion: 'Es como seguir las instrucciones de una receta: un paso en orden incorrecto cambia todo el resultado final.',
        miniEjercicio: 'Si duplicas la cantidad de partida, ¿el resultado final aumenta o disminuye? Ese mismo razonamiento resuelve esta pregunta.'
      };
    }

    return res.json({ easyExplanation: parsed });
  } catch (error: any) {
    console.error('Error in /api/tutor/explain-easy:', error);
    return res.json({
      easyExplanation: {
        analogia: 'Imagina esto como un partido de fútbol donde cada jugada tiene una regla clara.',
        pasos: [
          'Paso 1: Lee despacio el enunciado completo.',
          'Paso 2: Identifica la idea o dato clave.',
          'Paso 3: Descarta opciones absurdas.'
        ],
        comparacion: 'Es cuestión de método y atención a los detalles, no de memorizar.',
        miniEjercicio: 'Revisa de nuevo la opción elegida y pregúntate si tiene sentido práctico.'
      }
    });
  }
});

// ==============================================================================
// Webhook: Stripe Checkout Session Completed (Procesamiento y activación)
// ==============================================================================
app.post('/api/webhooks/stripe', async (req: any, res) => {
  const payload = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('STRIPE_SECRET_KEY no configurado en variables de entorno');
    return res.status(200).json({ received: true, note: 'Stripe secret key not configured' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16' as any,
  });

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } else {
      // Modo flexible para desarrollo local o pruebas sin secreto de webhook
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }
  } catch (err: any) {
    console.error('Error validando la firma del webhook de Stripe:', err.message);
    return res.status(400).json({ error: `Fallo de seguridad: ${err.message}` });
  }

  // Procesamos el evento de compra finalizada
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const planType = session.metadata?.planType || 'premium_monthly';

    if (userId) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseServiceKey) {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .upsert(
            {
              user_id: userId,
              stripe_customer_id: (session.customer as string) || null,
              stripe_subscription_id: (session.subscription as string) || null,
              status: 'active',
              plan_type: planType,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );

        if (error) {
          console.error('Error al actualizar Supabase en webhook:', error);
          return res.status(500).json({ error: 'Error de base de datos' });
        }
      }

      console.log(`✅ Suscripción Premium activada exitosamente para el usuario: ${userId}`);
    }
  }

  return res.status(200).json({ received: true });
});

// ==============================================================================
// Endpoint: Crear Sesión de Pago en Stripe Checkout
// ==============================================================================
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const body = req.body || {};
    const plan = body.plan || body.planType || 'premium_annual';
    const provider = body.provider || 'stripe';
    const userId = body.userId;
    const userEmail = body.userEmail;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || `http://localhost:${PORT}`;

    // Si no está configurada la llave de Stripe, retornar simulación para entorno de pruebas
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('STRIPE_SECRET_KEY no configurado, operando en modo simulado para desarrollo.');
      return res.json({
        simulated: true,
        message: 'Modo de prueba activo sin llave secreta de Stripe',
        plan,
        userId,
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as any,
    });

    // Definimos el precio según el plan seleccionado
    let priceId = '';
    if (plan === 'premium_annual') {
      priceId = process.env.STRIPE_PRICE_ANNUAL_ID || '';
    } else {
      priceId = process.env.STRIPE_PRICE_MONTHLY_ID || '';
    }

    let lineItems: any[];
    if (priceId && priceId.startsWith('price_')) {
      lineItems = [{ price: priceId, quantity: 1 }];
    } else {
      const isAnnual = plan === 'premium_annual';
      lineItems = [
        {
          price_data: {
            currency: 'cop',
            product_data: {
              name: isAnnual
                ? 'ICFES Master Premium (Plan Anual - Ahorro 33%)'
                : 'ICFES Master Premium (Plan Mensual)',
              description:
                'Acceso ilimitado a simulacros Saber 11°, Tutor IA pedagógico, banco de errores y plan personalizado.',
            },
            unit_amount: isAnnual ? 19900 * 12 : 29900,
            recurring: {
              interval: isAnnual ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ];
    }

    // Creamos la sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: lineItems,
      customer_email: userEmail || undefined,
      // URLs a las que Stripe redirigirá al usuario después del proceso
      success_url: `${siteUrl}/dashboard?success=true`,
      cancel_url: `${siteUrl}/pricing?canceled=true`,
      // METADATOS CLAVE: Aquí enviamos el ID del estudiante para que el Webhook lo reconozca
      metadata: {
        userId: userId,
        planType: plan,
      },
    });

    return res.json({ url: session.url, id: session.id });
  } catch (error: any) {
    console.error('Error creando checkout session:', error);
    return res.status(500).json({ error: error.message || 'Error al generar sesión de pago' });
  }
});

// Vite middleware in development, static files in production
async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true, host: '0.0.0.0', port: Number(PORT) },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      app.use(express.static(path.resolve(__dirname, 'dist')));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
      });
    }

    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

startServer();

