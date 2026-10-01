/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { TutorDrawer } from './components/TutorDrawer';
import { BookOpen } from 'lucide-react';

// Views
import { HomeView } from './views/HomeView';
import { DiagnosticView } from './views/DiagnosticView';
import { PracticeSelectView } from './views/PracticeSelectView';
import { PracticeSessionView } from './views/PracticeSessionView';
import { MockSelectView } from './views/MockSelectView';
import { MockExamView } from './views/MockExamView';
import { MockResultView } from './views/MockResultView';
import { ProgressView } from './views/ProgressView';
import { LearnView } from './views/LearnView';
import { MistakesView } from './views/MistakesView';
import { StudyPlanView } from './views/StudyPlanView';
import { ProfileView } from './views/ProfileView';
import { PricingView } from './views/PricingView';
import { AuthView } from './views/AuthView';

const MainContent: React.FC = () => {
  const { currentView, accessibility, profile, isAuthLoading, activeSessionData, setActiveSessionData, setCurrentView, startPractice } = useApp();

  // 1. Initial Supabase session verification loader
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="text-center space-y-4 animate-in fade-in duration-300">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white mx-auto shadow-lg animate-pulse">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100">
              ICFES MASTER SABER 11°
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verificando sesión segura en Supabase...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Strict Auth Gate: Unauthenticated users CANNOT see the Dashboard
  if (!profile || !profile.isAuthenticated) {
    return (
      <div
        className={`min-h-screen flex flex-col font-sans transition-colors ${
          accessibility.highContrast
            ? 'bg-slate-100 text-slate-950 dark:bg-black dark:text-white contrast-125'
            : 'bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'
        } ${
          accessibility.fontSize === 'large'
            ? 'text-base'
            : accessibility.fontSize === 'xlarge'
            ? 'text-lg'
            : 'text-sm'
        }`}
      >
        <Header />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-5 sm:py-6">
          {currentView === 'pricing' ? <PricingView /> : <AuthView />}
        </main>
      </div>
    );
  }

  // 3. Authenticated session: full student dashboard and features
  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        accessibility.highContrast
          ? 'bg-slate-100 text-slate-950 dark:bg-black dark:text-white contrast-125'
          : 'bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'
      } ${
        accessibility.fontSize === 'large'
          ? 'text-base'
          : accessibility.fontSize === 'xlarge'
          ? 'text-lg'
          : 'text-sm'
      }`}
    >
      {/* Sticky Header with Stats, Level, XP, Tutor & Accessibility controls */}
      <Header />

      {/* Desktop sub-navigation */}
      <Navigation />

      {/* Primary View Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-5 sm:py-6 pb-24 md:pb-8">
        {currentView === 'home' && <HomeView />}
        {currentView === 'diagnostic' && <DiagnosticView />}
        {currentView === 'practice_select' && <PracticeSelectView />}
        {currentView === 'practice_session' && (
          <PracticeSessionView
            sessionId={activeSessionData?.sessionId}
            initialAnswers={activeSessionData?.answers}
          />
        )}
        {currentView === 'mock_select' && (
          <MockSelectView
            onNavigateToPractice={(sessionId, answers, timeElapsed) => {
              setActiveSessionData({ sessionId, answers, timeElapsed });
              setCurrentView('mock_exam');
            }}
          />
        )}
        {currentView === 'mock_exam' && (
          <MockExamView
            sessionId={activeSessionData?.sessionId}
            initialAnswers={activeSessionData?.answers}
            initialTimeElapsed={activeSessionData?.timeElapsed}
          />
        )}
        {currentView === 'mock_result' && <MockResultView />}
        {currentView === 'progress' && <ProgressView />}
        {currentView === 'learn' && <LearnView />}
        {currentView === 'mistakes' && <MistakesView />}
        {currentView === 'study_plan' && (
          <StudyPlanView
            onNavigateToPractice={(target) => {
              if (target === 'lectura_critica') {
                startPractice({ type: 'normal', area: 'LECTURA_CRITICA' });
              } else if (target === 'matematicas') {
                startPractice({ type: 'normal', area: 'MATEMATICAS' });
              } else if (target === 'ciencias_naturales') {
                startPractice({ type: 'normal', area: 'CIENCIAS_NATURALES' });
              } else if (target === 'sociales') {
                startPractice({ type: 'normal', area: 'SOCIALES_CIUDADANAS' });
              } else if (target === 'ingles') {
                startPractice({ type: 'normal', area: 'INGLES' });
              } else {
                startPractice({ type: 'normal' });
              }
            }}
            onNavigateToMistakes={() => setCurrentView('mistakes')}
          />
        )}
        {currentView === 'profile' && <ProfileView />}
        {currentView === 'pricing' && <PricingView />}
        {currentView === 'auth' && <AuthView />}
      </main>

      {/* Global AI Tutor Drawer / Modal */}
      <TutorDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
