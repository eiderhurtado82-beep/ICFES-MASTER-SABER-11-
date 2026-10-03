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
  PlusCircle,
  Trash2,
  FileQuestion,
  HelpCircle,
  BookOpen,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminDashboardView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'questions'>('users');

  // Estudiantes
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Preguntas en Supabase (preguntas_icfes)
  const [questions, setQuestions] = useState<any[]>([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedMateria, setSelectedMateria] = useState<string>('TODAS');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);

  // Formulario nueva pregunta
  const [newQuestion, setNewQuestion] = useState({
    materia: 'MATEMATICAS',
    contexto: '',
    enunciado: '',
    opcion_a: '',
    opcion_b: '',
    opcion_c: '',
    opcion_d: '',
    respuesta_correcta: 'A',
    explicacion: '',
  });

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
    await Promise.all([fetchUsers(), fetchQuestions()]);
  };

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: subs, error: sError } = await supabase
        .from('subscriptions')
        .select('*');

      if (pError || sError) {
        console.warn('Nota al consultar perfiles/suscripciones:', pError || sError);
      }

      if (profiles) {
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

  const fetchQuestions = async () => {
    setIsQuestionsLoading(true);
    try {
      const { data, error } = await supabase
        .from('preguntas_icfes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Nota al consultar preguntas_icfes:', error.message);
      } else if (data) {
        setQuestions(data);
      }
    } catch (err: any) {
      console.error('Error al cargar preguntas:', err);
    } finally {
      setIsQuestionsLoading(false);
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
      await fetchUsers();
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

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.enunciado.trim() || !newQuestion.explicacion.trim()) {
      setNotification({ type: 'error', message: 'Por favor completa el enunciado y la explicación.' });
      return;
    }
    if (!newQuestion.opcion_a || !newQuestion.opcion_b || !newQuestion.opcion_c || !newQuestion.opcion_d) {
      setNotification({ type: 'error', message: 'Debes completar las 4 opciones de respuesta (A, B, C, D).' });
      return;
    }

    setIsSavingQuestion(true);
    try {
      const { error } = await supabase.from('preguntas_icfes').insert([
        {
          materia: newQuestion.materia,
          contexto: newQuestion.contexto.trim() || null,
          enunciado: newQuestion.enunciado.trim(),
          opcion_a: newQuestion.opcion_a.trim(),
          opcion_b: newQuestion.opcion_b.trim(),
          opcion_c: newQuestion.opcion_c.trim(),
          opcion_d: newQuestion.opcion_d.trim(),
          respuesta_correcta: newQuestion.respuesta_correcta,
          explicacion: newQuestion.explicacion.trim(),
        },
      ]);

      if (error) {
        setNotification({ type: 'error', message: 'Error al guardar la pregunta: ' + error.message });
      } else {
        setNotification({ type: 'success', message: '✅ Pregunta agregada al banco de preguntas en Supabase' });
        setShowAddModal(false);
        setNewQuestion({
          materia: 'MATEMATICAS',
          contexto: '',
          enunciado: '',
          opcion_a: '',
          opcion_b: '',
          opcion_c: '',
          opcion_d: '',
          respuesta_correcta: 'A',
          explicacion: '',
        });
        await fetchQuestions();
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: 'Error inesperado: ' + err.message });
    } finally {
      setIsSavingQuestion(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    const { error } = await supabase.from('preguntas_icfes').delete().eq('id', id);
    if (!error) {
      setNotification({ type: 'success', message: 'Pregunta eliminada de Supabase.' });
      await fetchQuestions();
    } else {
      setNotification({ type: 'error', message: 'Error al eliminar: ' + error.message });
    }
    setTimeout(() => setNotification(null), 4000);
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

  const filteredQuestions = questions.filter((q) => {
    const matchSearch =
      q.enunciado?.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.contexto?.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.materia?.toLowerCase().includes(questionSearch.toLowerCase());
    const matchMateria =
      selectedMateria === 'TODAS' || q.materia === selectedMateria;
    return matchSearch && matchMateria;
  });

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
            Gestión completa de estudiantes, suscripciones y banco de preguntas en Supabase.
          </p>
        </div>

        {/* Pestañas de Navegación del Panel */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users size={14} /> Estudiantes ({totalStudents})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileQuestion size={14} /> Preguntas Supabase ({questions.length})
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* PESTAÑA 1: GESTIÓN DE USUARIOS Y SUSCRIPCIONES */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
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

          {/* Buscador de Estudiantes */}
          <div className="flex justify-end">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Buscar estudiante o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none w-full text-xs"
              />
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
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 2: BANCO DE PREGUNTAS EN SUPABASE (preguntas_icfes) */}
      {/* ========================================================================= */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Barra de Acciones y Filtros */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar en preguntas o contexto..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-xs w-64"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Filter size={14} />
                <select
                  value={selectedMateria}
                  onChange={(e) => setSelectedMateria(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="TODAS">Todas las Materias</option>
                  <option value="MATEMATICAS">Matemáticas</option>
                  <option value="LECTURA_CRITICA">Lectura Crítica</option>
                  <option value="CIENCIAS_NATURALES">Ciencias Naturales</option>
                  <option value="SOCIALES_CIUDADANAS">Sociales y Ciudadanas</option>
                  <option value="INGLES">Inglés</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchQuestions}
                disabled={isQuestionsLoading}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Actualizar preguntas"
              >
                <RefreshCw size={16} className={isQuestionsLoading ? 'animate-spin text-blue-400' : ''} />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <PlusCircle size={16} />
                Nueva Pregunta
              </button>
            </div>
          </div>

          {/* Listado de Preguntas */}
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold">
                      {q.materia}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      #{idx + 1} • ID: {q.id?.substring(0, 8)}...
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Eliminar pregunta"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {q.contexto && (
                  <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 italic">
                    {q.contexto}
                  </div>
                )}

                <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                  {q.enunciado}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      q.respuesta_correcta === 'A'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="font-mono mr-1.5">A.</span> {q.opcion_a}
                  </div>
                  <div
                    className={`p-2.5 rounded-xl border ${
                      q.respuesta_correcta === 'B'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="font-mono mr-1.5">B.</span> {q.opcion_b}
                  </div>
                  <div
                    className={`p-2.5 rounded-xl border ${
                      q.respuesta_correcta === 'C'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="font-mono mr-1.5">C.</span> {q.opcion_c}
                  </div>
                  <div
                    className={`p-2.5 rounded-xl border ${
                      q.respuesta_correcta === 'D'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="font-mono mr-1.5">D.</span> {q.opcion_d}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2">
                  <HelpCircle size={15} className="shrink-0 mt-0.5 text-indigo-400" />
                  <div>
                    <span className="font-bold">Explicación Oficial:</span> {q.explicacion}
                  </div>
                </div>
              </div>
            ))}

            {filteredQuestions.length === 0 && (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
                <FileQuestion size={40} className="mx-auto text-slate-600" />
                <p className="text-sm text-slate-400">
                  {questions.length === 0
                    ? 'Aún no hay preguntas en la tabla "preguntas_icfes" de Supabase.'
                    : 'No hay preguntas que coincidan con los filtros aplicados.'}
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle size={14} /> Crear la primera pregunta
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal / Formulario Nueva Pregunta */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <PlusCircle className="text-blue-500" size={20} />
                Agregar Pregunta a Supabase (`preguntas_icfes`)
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Materia</label>
                  <select
                    value={newQuestion.materia}
                    onChange={(e) => setNewQuestion({ ...newQuestion, materia: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="MATEMATICAS">Matemáticas</option>
                    <option value="LECTURA_CRITICA">Lectura Crítica</option>
                    <option value="CIENCIAS_NATURALES">Ciencias Naturales</option>
                    <option value="SOCIALES_CIUDADANAS">Sociales y Ciudadanas</option>
                    <option value="INGLES">Inglés</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Respuesta Correcta</label>
                  <select
                    value={newQuestion.respuesta_correcta}
                    onChange={(e) => setNewQuestion({ ...newQuestion, respuesta_correcta: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:border-blue-500 focus:outline-none font-bold text-emerald-400"
                  >
                    <option value="A">Opción A</option>
                    <option value="B">Opción B</option>
                    <option value="C">Opción C</option>
                    <option value="D">Opción D</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Contexto / Texto de la Situación (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="En una encuesta realizada a 500 personas..."
                  value={newQuestion.contexto}
                  onChange={(e) => setNewQuestion({ ...newQuestion, contexto: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Enunciado o Pregunta Central *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="¿Cuál de las siguientes afirmaciones es correcta con base en...?"
                  value={newQuestion.enunciado}
                  onChange={(e) => setNewQuestion({ ...newQuestion, enunciado: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Opción A *</label>
                  <input
                    type="text"
                    required
                    value={newQuestion.opcion_a}
                    onChange={(e) => setNewQuestion({ ...newQuestion, opcion_a: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Opción B *</label>
                  <input
                    type="text"
                    required
                    value={newQuestion.opcion_b}
                    onChange={(e) => setNewQuestion({ ...newQuestion, opcion_b: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Opción C *</label>
                  <input
                    type="text"
                    required
                    value={newQuestion.opcion_c}
                    onChange={(e) => setNewQuestion({ ...newQuestion, opcion_c: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Opción D *</label>
                  <input
                    type="text"
                    required
                    value={newQuestion.opcion_d}
                    onChange={(e) => setNewQuestion({ ...newQuestion, opcion_d: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Explicación Pedagógica *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Justificación conceptual del por qué la opción es la correcta..."
                  value={newQuestion.explicacion}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explicacion: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingQuestion}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-600/20"
                >
                  {isSavingQuestion ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Guardando...
                    </>
                  ) : (
                    'Guardar en Supabase'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardView;
