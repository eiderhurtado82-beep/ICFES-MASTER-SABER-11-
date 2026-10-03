import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Zap,
  Sparkles,
  Bot,
  Settings,
  Eye,
  Type,
  ChevronDown,
  BookOpen,
  Sun,
  Moon,
  Crown,
  User,
  LogIn,
  ShieldCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    profile,
    currentView,
    setCurrentView,
    accessibility,
    setAccessibility,
    setIsTutorDrawerOpen,
    isDarkMode,
    toggleDarkMode,
  } = useApp();

  const [showAccessMenu, setShowAccessMenu] = useState(false);

  const toggleFontSize = () => {
    setAccessibility((prev) => ({
      ...prev,
      fontSize:
        prev.fontSize === 'normal'
          ? 'large'
          : prev.fontSize === 'large'
          ? 'xlarge'
          : 'normal',
    }));
  };

  const toggleContrast = () => {
    setAccessibility((prev) => ({
      ...prev,
      highContrast: !prev.highContrast,
    }));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <button
          onClick={() => setCurrentView(profile && profile.isAuthenticated ? 'home' : 'auth')}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-600 dark:from-blue-400 dark:to-amber-400 bg-clip-text text-transparent">
                ICFES MASTER
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                SABER 11°
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              Ecosistema de Preparación por Competencias
            </p>
          </div>
        </button>

        {/* Center / Right stats & utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {profile && profile.isAuthenticated && (
            <>
              {/* Streak Badge */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-300"
                title="Días consecutivos de estudio"
              >
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{profile.streakDays} d</span>
              </div>

              {/* XP & Level Badge */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300"
                title={`Nivel ${profile.level} (${profile.xp} XP)`}
              >
                <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600 dark:text-indigo-400" />
                <span className="hidden xs:inline">Nv.{profile.level}</span>
                <span className="font-mono text-[11px]">{profile.xp} XP</span>
              </div>
            </>
          )}

          {/* Premium / Subscription CTA Button */}
          <button
            onClick={() => setCurrentView('pricing')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 ${
              currentView === 'pricing'
                ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                : profile?.subscriptionPlan === 'premium'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/20 ring-1 ring-amber-400/40 hover:brightness-105'
            }`}
            title="Ver Planes y Precios de Suscripción"
          >
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">
              {profile?.subscriptionPlan === 'premium' ? 'Plan PRO Activo' : 'Hazte Premium'}
            </span>
            <span className="sm:hidden">PRO</span>
          </button>

          {/* Admin Panel Button (Exclusive for Superadmin) */}
          {profile && profile.email === 'eiderhurtado82@gmail.com' && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 ${
                currentView === 'admin'
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                  : 'bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white'
              }`}
              title="Panel de Administrador"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Tutor ICFES Button (Only for authenticated sessions) */}
          {profile && profile.isAuthenticated && (
            <button
              onClick={() => setIsTutorDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-sm hover:shadow hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              title="Abrir Tutor ICFES con IA"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tutor IA</span>
            </button>
          )}

          {/* Real Dark Mode Toggle (Independent from contrast) */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 active:scale-95 transition-all cursor-pointer shadow-2xs"
            title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            aria-label={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-in spin-in-90 duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 fill-slate-600/10 hover:text-indigo-600 transition-colors" />
            )}
          </button>

          {/* Accessibility Settings Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowAccessMenu(!showAccessMenu)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 active:scale-95 transition-all cursor-pointer shadow-2xs"
              title="Ajustes de Accesibilidad"
            >
              <Eye className="w-4 h-4" />
            </button>

            {showAccessMenu && (
              <div className="absolute right-0 mt-2 w-64 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  Accesibilidad & Visualización
                </p>

                {/* Dark Mode in menu */}
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    {isDarkMode ? (
                      <Moon className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    Tema Visual:
                  </span>
                  <button
                    onClick={toggleDarkMode}
                    className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors ${
                      isDarkMode
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
                  </button>
                </div>

                {/* Font size toggle */}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-slate-500" /> Tamaño de letra:
                  </span>
                  <button
                    onClick={toggleFontSize}
                    className="px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    {accessibility.fontSize === 'normal'
                      ? 'Normal'
                      : accessibility.fontSize === 'large'
                      ? 'Grande'
                      : 'Muy Grande'}
                  </button>
                </div>

                {/* Contrast toggle */}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-500" /> Alto Contraste:
                  </span>
                  <button
                    onClick={toggleContrast}
                    className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors ${
                      accessibility.highContrast
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {accessibility.highContrast ? 'Activado' : 'Desactivado'}
                  </button>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
                  Diseñado para preparación Saber 11°
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowAccessMenu(false);
                    setCurrentView(profile?.isAuthenticated ? 'profile' : 'auth');
                  }}
                  className="w-full mt-2 py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-100 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{profile?.isAuthenticated ? 'Ver Mi Perfil' : 'Iniciar Sesión / Registrarse'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Auth Button or Profile icon */}
          {!profile || !profile.isAuthenticated ? (
            <button
              onClick={() => setCurrentView('auth')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                currentView === 'auth'
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
              }`}
              title="Iniciar Sesión o Registrarse"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Ingresar</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('profile')}
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                currentView === 'profile'
                  ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title={`Sesión iniciada: ${profile.name || 'Estudiante'} (Ver Perfil)`}
            >
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
