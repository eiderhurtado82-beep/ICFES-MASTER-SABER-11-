import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, provider, userId } = body;

    if (!userId) {
      return Response.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    // Definimos el precio según el plan seleccionado
    // Nota: Debes crear estos productos en tu panel de Stripe y reemplazar los IDs (price_...)
    let priceId = '';
    if (plan === 'premium_annual') {
      priceId = process.env.STRIPE_PRICE_ANNUAL_ID || 'price_annual_default';
    } else {
      priceId = process.env.STRIPE_PRICE_MONTHLY_ID || 'price_monthly_default';
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3000';

    // Creamos la sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // URLs a las que Stripe redirigirá al usuario después del proceso
      success_url: `${siteUrl}/dashboard?success=true`,
      cancel_url: `${siteUrl}/pricing?canceled=true`,
      // METADATOS CLAVE: Aquí enviamos el ID del estudiante para que el Webhook lo reconozca
      metadata: {
        userId: userId,
        planType: plan,
      },
    });

    return Response.json({ url: session.url });

  } catch (error: any) {
    console.error('Error creando checkout session:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
