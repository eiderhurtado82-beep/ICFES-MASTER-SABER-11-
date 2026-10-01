import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Search,
  Star,
  ShieldCheck,
  ArrowLeft,
  Users,
  Award,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminDashboardView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // ADMINISTRADOR PRINCIPAL
  const ADMIN_EMAIL = 'eiderhurtado82@gmail.com';

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    setIsLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Verificación de seguridad estricta
    if (!session || session.user.email !== ADMIN_EMAIL) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    setIsAdmin(true);
    await fetchUsers();
  };

  const fetchUsers = async () => {
    try {
      // Obtenemos todos los perfiles
      const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Obtenemos todas las suscripciones
      const { data: subs, error: sError } = await supabase
        .from('subscriptions')
        .select('*');

      if (pError || sError) {
        console.warn('Nota al consultar perfiles/suscripciones:', pError || sError);
      }

      if (profiles) {
        // Combinamos la información para la tabla
        const combinedUsers = profiles.map((profile) => {
          const userSub = subs?.find((s) => s.user_id === profile.id);
          return {
            ...profile,
            subscription: userSub || { plan_type: 'free', status: 'free' },
          };
        });
        setUsers(combinedUsers);
      }
    } catch (err: any) {
      console.error('Error al cargar datos de estudiantes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePremium = async (userId: string, currentPlan: string) => {
    const isCurrentlyPremium = currentPlan !== 'free';
    const newPlan = isCurrentlyPremium ? 'free' : 'premium_monthly';
    const newStatus = isCurrentlyPremium ? 'free' : 'active';

    setIsUpdating(userId);

    const { error } = await supabase
      .from('subscriptions')
      .upsert(
        {
          user_id: userId,
          plan_type: newPlan,
          status: newStatus,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    setIsUpdating(null);

    if (!error) {
      await fetchUsers(); // Recargamos la tabla
      const msg = isCurrentlyPremium
        ? '❌ Plan Premium Revocado correctamente'
        : '✅ ¡Plan Premium Activado Exitosamente!';
      setNotification({ type: 'success', message: msg });
      setTimeout(() => setNotification(null), 5000);
    } else {
      setNotification({
        type: 'error',
        message: 'Error al actualizar suscripción: ' + error.message,
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="p-20 text-center text-slate-400 flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm font-medium">Verificando credenciales de seguridad...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-20 text-center text-white flex flex-col items-center animate-in fade-in">
        <ShieldAlert size={64} className="text-red-500 mb-4 animate-bounce" />
        <h2 className="text-3xl font-bold">Acceso Denegado</h2>
        <p className="text-slate-400 mt-2 max-w-md">
          Esta área es exclusiva para la administración de ICFES Master. La cuenta activa no cuenta con privilegios de superadministrador.
        </p>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={16} /> Volver al Inicio
        </button>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = users.length;
  const premiumStudents = users.filter(
    (u) => u.subscription?.plan_type !== 'free' && u.subscription?.status === 'active'
  ).length;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto text-white space-y-6 animate-in fade-in duration-200">
      {/* Toast Notificación */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/90 border border-red-500/50 text-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold px-2 py-1 rounded hover:bg-white/10"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Cabecera del Panel */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => setCurrentView('home')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer mr-1"
              title="Volver al Inicio"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              <ShieldCheck className="text-blue-500" size={32} />
              Panel de Administrador
            </h2>
          </div>
          <p className="text-slate-400 text-sm ml-9">
            Gestiona accesos, suscripciones y becas de tus estudiantes en tiempo real.
          </p>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar estudiante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none w-full sm:w-72 text-sm"
          />
        </div>
      </header>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Estudiantes</p>
            <p className="text-2xl font-black text-white">{totalStudents}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Star size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Planes Premium</p>
            <p className="text-2xl font-black text-emerald-400">{premiumStudents}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Cuentas Básicas</p>
            <p className="text-2xl font-black text-slate-300">{totalStudents - premiumStudents}</p>
          </div>
        </div>
      </div>

      {/* Tabla de Estudiantes */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4">Estudiante</th>
                <th className="p-4">Nivel / XP</th>
                <th className="p-4">Estado del Plan</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => {
                const isPremium =
                  user.subscription?.plan_type !== 'free' &&
                  user.subscription?.status === 'active';
                const isCurrentlyUpdating = isUpdating === user.id;

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-semibold text-white text-sm">
                        {user.full_name || 'Sin nombre'}
                      </p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-xs">
                        ID: {user.id}
                      </p>
                    </td>
                    <td className="p-4 text-slate-300 text-sm">
                      <span className="font-bold text-indigo-400">Lvl {user.level || 1}</span>{' '}
                      <span className="text-xs text-slate-500 ml-1">({user.xp || 0} XP)</span>
                    </td>
                    <td className="p-4">
                      {isPremium ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                          <Star size={12} className="fill-emerald-400 text-emerald-400" /> Premium (
                          {user.subscription?.plan_type === 'premium_annual' ? 'Anual' : 'Mensual'})
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full font-medium">
                          Básico (Gratis)
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        disabled={isCurrentlyUpdating}
                        onClick={() => togglePremium(user.id, user.subscription?.plan_type || 'free')}
                        className={`text-xs px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                          isPremium
                            ? 'border border-red-500/40 text-red-400 hover:bg-red-500/10'
                            : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md hover:shadow-blue-500/20'
                        } ${isCurrentlyUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isCurrentlyUpdating
                          ? 'Actualizando...'
                          : isPremium
                          ? 'Quitar Premium'
                          : 'Activar Premium'}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500 text-sm">
                    No se encontraron estudiantes registrados con el término de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
