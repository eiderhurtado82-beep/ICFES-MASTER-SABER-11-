import React from 'react';
import { useApp, ViewType } from '../context/AppContext';
import {
  Home,
  Target,
  Clock,
  BookOpen,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Crown,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentView, setCurrentView, profile } = useApp();

  if (!profile) return null;

  const pendingMistakesCount = profile.mistakes.filter(
    (m) => m.status === 'pending'
  ).length;

  const desktopNavItems: Array<{
    id: ViewType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'practice_select', label: 'Práctica', icon: Target },
    { id: 'mock_select', label: 'Simulacros', icon: Clock },
    {
      id: 'mistakes',
      label: 'Mis Errores',
      icon: AlertTriangle,
      badge: pendingMistakesCount > 0 ? pendingMistakesCount : undefined,
    },
    { id: 'progress', label: 'Progreso', icon: BarChart3 },
    { id: 'learn', label: 'Aprende', icon: BookOpen },
    { id: 'study_plan', label: 'Plan', icon: CalendarDays },
  ];

  const mobileNavItems: Array<{
    id: ViewType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isHighlight?: boolean;
  }> = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'practice_select', label: 'Práctica', icon: Target },
    { id: 'mock_select', label: 'Simulacros', icon: Clock },
    { id: 'learn', label: 'Aprende', icon: BookOpen },
    { id: 'pricing', label: 'Premium', icon: Crown, isHighlight: true },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Visible on phones & tablets) */}
      <nav aria-label="Navegación móvil" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg px-2 py-1">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentView === item.id ||
              (item.id === 'practice_select' && currentView === 'practice_session') ||
              (item.id === 'mock_select' &&
                (currentView === 'mock_exam' || currentView === 'mock_result')) ||
              (item.id === 'learn' && currentView === 'learn_topic');

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                  item.isHighlight && !isActive
                    ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                    : isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'stroke-[2.5]' : ''
                    } ${item.isHighlight && !isActive ? 'text-amber-500 fill-amber-500/20' : ''}`}
                  />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Top Sub-Navbar */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between gap-2 py-2">
          <div className="flex items-center gap-1 overflow-x-auto">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentView === item.id ||
                (item.id === 'practice_select' && currentView === 'practice_session') ||
                (item.id === 'mock_select' &&
                  (currentView === 'mock_exam' || currentView === 'mock_result')) ||
                (item.id === 'learn' && currentView === 'learn_topic');

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop Subscription / Premium Button */}
          <button
            onClick={() => setCurrentView('pricing')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 ${
              currentView === 'pricing'
                ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                : profile.subscriptionPlan === 'premium'
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/20 ring-1 ring-amber-400/40 hover:brightness-105'
            }`}
          >
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span>{profile.subscriptionPlan === 'premium' ? 'Plan PRO' : 'Hazte Premium'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
