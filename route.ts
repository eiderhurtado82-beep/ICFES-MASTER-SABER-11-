import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// 1. Inicializamos Stripe de forma segura
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

// 2. Cliente de Supabase Admin (Bypass RLS)
// IMPORTANTE: Usamos la SERVICE_ROLE_KEY, no la ANON_KEY, porque el que 
// hace esta petición es Stripe (el servidor), no el usuario en el navegador.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
);

export async function POST(req: Request) {
  // Leemos el payload crudo necesario para verificar la firma criptográfica
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;

  try {
    // 3. Validamos que la petición realmente venga de Stripe
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } else {
      event = JSON.parse(payload);
    }
  } catch (err: any) {
    console.error('Error validando la firma del webhook:', err.message);
    return Response.json({ error: `Fallo de seguridad: ${err.message}` }, { status: 400 });
  }

  // 4. Procesamos el evento de compra finalizada
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Recuperamos el user_id que debiste pasar como metadata al crear el link de pago
    const userId = session.metadata?.userId;
    const planType = session.metadata?.planType || 'premium_monthly';

    if (userId) {
      // 5. Actualizamos la base de datos de Supabase a estado 'active'
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .upsert(
          {
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: 'active',
            plan_type: planType,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error('Error al actualizar Supabase:', error);
        return Response.json({ error: 'Error de base de datos' }, { status: 500 });
      }

      console.log(`✅ Suscripción Premium activada para el usuario: ${userId}`);
    }
  }

  // 6. Stripe requiere un código 200 rápido para saber que recibimos el mensaje
  return Response.json({ received: true }, { status: 200 });
}
