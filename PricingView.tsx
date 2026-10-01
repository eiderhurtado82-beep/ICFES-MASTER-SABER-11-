import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Crown,
  Smartphone,
  Check,
  Copy,
  MessageCircle,
  X,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { DisclaimerNotice } from '../components/DisclaimerNotice';

export const PricingView: React.FC = () => {
  const { profile, updateProfile, setCurrentView, triggerConfettiCelebration } = useApp();
  const [isAnnual, setIsAnnual] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNequiModalOpen, setIsNequiModalOpen] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [successNotification, setSuccessNotification] = useState<string | null>(null);

  // Precios en COP
  const monthlyPrice = 29900;
  const annualPrice = 19900; // Por mes, facturado anualmente

  const isAlreadyPremium = profile?.subscriptionPlan === 'premium';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2500);
  };

  const handleSubscribe = async (provider: 'stripe' | 'paypal' | 'nequi') => {
    if (provider === 'nequi') {
      setIsNequiModalOpen(true);
      return;
    }

    setIsProcessing(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.warn('No hay sesión activa');
      setCurrentView('auth');
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: isAnnual ? 'premium_annual' : 'premium_monthly',
          provider: provider,
          userId: session.user.id, // Pasamos el ID del usuario autenticado
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirigimos al estudiante a la pasarela de pago segura de Stripe
        window.location.href = data.url;
      } else if (data.simulated) {
        // Modo prueba / desarrollo sin llave de Stripe configurada
        const planKey = isAnnual ? 'premium_annual' : 'premium_monthly';
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + (isAnnual ? 1 : 0));
        if (!isAnnual) expiryDate.setMonth(expiryDate.getMonth() + 1);

        try {
          await supabase.from('subscriptions').upsert(
            {
              user_id: session.user.id,
              status: 'active',
              plan_type: planKey,
              current_period_end: expiryDate.toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
        } catch (dbErr) {
          console.warn('Nota al actualizar suscripción:', dbErr);
        }

        updateProfile({
          subscriptionPlan: 'premium',
          subscriptionExpiry: expiryDate.toISOString().split('T')[0],
        });

        triggerConfettiCelebration();
        setSuccessNotification('¡Felicitaciones! Tu suscripción ICFES Master Premium ha sido activada.');
        setTimeout(() => setSuccessNotification(null), 6000);
        setIsProcessing(false);
      } else {
        console.error('No se recibió URL de pago:', data.error);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error al procesar pago:', error);
      setIsProcessing(false);
    }
  };

  const studentName = profile?.name || 'Estudiante';
  const whatsappMsg = `¡Hola! Quiero activar mi Plan Premium de ICFES Master Saber 11° (${
    isAnnual ? 'Plan Anual' : 'Plan Mensual'
  }) a nombre de ${studentName}. Adjunto el comprobante de transferencia.`;
  const whatsappUrl = `https://wa.me/573148436728?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto text-white space-y-10">
      {/* Notificación de éxito */}
      {successNotification && (
        <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-200 flex items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{successNotification}</span>
          </div>
          <button
            onClick={() => setSuccessNotification(null)}
            className="text-xs text-emerald-400 hover:text-emerald-200 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Header con Toggle */}
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5" />
          <span>Membresía Oficial Saber 11°</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
          Asegura tu ingreso a la Universidad
        </h2>
        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal">
          Desbloquea simulacros ilimitados, retroalimentación con IA y planes de estudio personalizados para maximizar tu puntaje ICFES.
        </p>

        {/* Toggle Mensual / Anual */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>
            Mensual
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 bg-blue-600 rounded-full p-1 transition-colors flex items-center cursor-pointer shadow-inner"
            aria-label="Alternar ciclo de facturación"
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                isAnnual ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-bold ${isAnnual ? 'text-white' : 'text-slate-400'} flex items-center gap-2`}>
            Anual{' '}
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Ahorras 33%
            </span>
          </span>
        </div>
      </header>

      {/* Grid de Precios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* Plan Gratuito (Básico) */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">Básico</h3>
              {!isAlreadyPremium && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-700 text-slate-300">
                  Plan Activo
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm mb-6">Perfecto para conocer la plataforma.</p>
            <div className="text-4xl font-black mb-8 text-white">
              $0 <span className="text-lg text-slate-500 font-normal">/mes</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-slate-500 shrink-0 mt-0.5" size={20} />
                <span className="text-slate-300 text-sm">1 Simulacro global de prueba</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-slate-500 shrink-0 mt-0.5" size={20} />
                <span className="text-slate-300 text-sm">Acceso a preguntas nivel básico</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-slate-500 shrink-0 mt-0.5" size={20} />
                <span className="text-slate-300 text-sm">Registro de XP (Gamificación)</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <span className="w-5 h-5 flex items-center justify-center text-slate-600 font-bold">—</span>
                <span className="text-slate-500 text-sm line-through">Tutor IA Pedagógico ilimitado</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <span className="w-5 h-5 flex items-center justify-center text-slate-600 font-bold">—</span>
                <span className="text-slate-500 text-sm line-through">Banco de Errores con IA</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full py-3.5 rounded-xl font-bold bg-slate-700/60 text-slate-400 cursor-not-allowed text-sm"
          >
            {isAlreadyPremium ? 'Plan Gratuito Superado' : 'Tu plan actual'}
          </button>
        </div>

        {/* Plan Premium */}
        <div className="bg-gradient-to-b from-blue-950/60 via-slate-900 to-slate-900 border-2 border-blue-500 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transform md:-translate-y-2 shadow-2xl shadow-blue-900/30">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg tracking-wider">
            <Sparkles size={14} className="text-amber-300" /> RECOMENDADO
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <span>ICFES Master Premium</span>
              </h3>
              {isAlreadyPremium && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Activo
                </span>
              )}
            </div>
            <p className="text-blue-200 text-sm mb-6">
              Todo el ecosistema para alcanzar los 400+ puntos.
            </p>

            <div className="text-4xl font-black mb-1 text-white">
              ${(isAnnual ? annualPrice : monthlyPrice).toLocaleString('es-CO')}
              <span className="text-lg text-blue-300 font-normal">/mes</span>
            </div>
            {isAnnual ? (
              <p className="text-xs text-blue-400 mb-6 font-medium">
                Facturado anualmente (${(annualPrice * 12).toLocaleString('es-CO')} COP/año)
              </p>
            ) : (
              <p className="text-xs text-blue-400 mb-6 font-medium">
                Cobro mensual recurrente sin cláusula de permanencia
              </p>
            )}

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Zap className="text-blue-400 shrink-0 mt-0.5" size={20} />
                <span className="text-white font-semibold text-sm">
                  Simulacros ilimitados en todas las áreas oficiales
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="text-blue-400 shrink-0 mt-0.5" size={20} />
                <span className="text-white font-semibold text-sm">
                  Tutor IA Pedagógico para justificar cada error
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="text-blue-400 shrink-0 mt-0.5" size={20} />
                <span className="text-white font-semibold text-sm">
                  Plan de estudio dinámico que se adapta a tus debilidades
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="text-blue-400 shrink-0 mt-0.5" size={20} />
                <span className="text-white font-semibold text-sm">
                  Simulacros de repaso personalizados de tu banco de errores
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="text-blue-400 shrink-0 mt-0.5" size={20} />
                <span className="text-white font-semibold text-sm">
                  Garantía incondicional de 7 días
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleSubscribe('stripe')}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl font-black bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 cursor-pointer active:scale-95 text-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Procesando pago seguro...</span>
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>{isAlreadyPremium ? 'Renovar con Tarjeta (Stripe)' : 'Obtener Premium con Tarjeta'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <button
              onClick={() => handleSubscribe('paypal')}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl font-bold border border-blue-500/30 hover:bg-blue-900/30 text-blue-300 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <span>Pagar con PayPal</span>
            </button>

            {/* Alternativa Local Colombiana Nequi / Daviplata */}
            <button
              onClick={() => handleSubscribe('nequi')}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Smartphone size={14} className="text-pink-400" />
              <span>O transferir por Nequi / Daviplata</span>
            </button>
          </div>

          <div className="mt-4 text-center flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Pago seguro y encriptado. Cancela cuando quieras.</span>
          </div>
        </div>
      </div>

      {/* Modal / Panel para Pago con Nequi y Daviplata */}
      {isNequiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-white relative shadow-2xl">
            <button
              onClick={() => setIsNequiModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 text-xs font-bold">
                <Smartphone size={14} />
                <span>Pago Local Colombia</span>
              </div>
              <h3 className="text-2xl font-bold">Transferencia Nequi / Daviplata</h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Transfiere{' '}
                <strong className="text-white">
                  ${(isAnnual ? annualPrice * 12 : monthlyPrice).toLocaleString('es-CO')} COP
                </strong>{' '}
                a cualquiera de nuestras cuentas oficiales y envía el comprobante.
              </p>
            </div>

            <div className="space-y-3">
              {/* Nequi */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-pink-400 uppercase tracking-wider">Nequi</div>
                  <div className="text-lg font-mono font-bold">3148436728</div>
                  <div className="text-xs text-slate-400">Titular: Eider Hurtado</div>
                </div>
                <button
                  onClick={() => handleCopy('3148436728', 'nequi')}
                  className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedLabel === 'nequi' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedLabel === 'nequi' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              {/* Daviplata */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">Daviplata</div>
                  <div className="text-lg font-mono font-bold">3122363479</div>
                  <div className="text-xs text-slate-400">Titular: Eider Hurtado</div>
                </div>
                <button
                  onClick={() => handleCopy('3122363479', 'daviplata')}
                  className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedLabel === 'daviplata' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedLabel === 'daviplata' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg text-sm"
              >
                <MessageCircle size={18} />
                <span>Enviar Comprobante por WhatsApp</span>
              </a>

              <button
                onClick={() => setIsNequiModalOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}

      <DisclaimerNotice />
    </div>
  );
};
