import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  SubjectArea,
  Question,
  MockExamResult,
  StudyPlanDay,
  Achievement,
  UserMistake,
} from '../types';
import { INITIAL_QUESTIONS } from '../data/questions';
import { supabase } from '../lib/supabase';

const ACCESSIBILITY_KEY = 'icfes_master_accessibility_v1';
const THEME_KEY = 'icfes_master_theme_v1';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_practice',
    title: 'Primera Práctica',
    description: 'Completa tu primera sesión de entrenamiento Saber 11°.',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'streak_7',
    title: 'Racha de Fuego (7 Días)',
    description: 'Estudia 7 días consecutivos sin romper la racha.',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'questions_100',
    title: 'Centenario de Preguntas',
    description: 'Responde 100 preguntas originales tipo ICFES.',
    icon: '📚',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
  },
  {
    id: 'math_expert',
    title: 'Experto en Matemáticas',
    description: 'Alcanza más del 80% de precisión en el área cuantitativa.',
    icon: '🧮',
    unlocked: false,
    progress: 0,
    maxProgress: 80,
  },
  {
    id: 'high_accuracy',
    title: 'Precisión de Francotirador',
    description: 'Obtén 90% o más de aciertos en una sesión de 10 preguntas.',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'mock_champion',
    title: 'Simulacro Completado',
    description: 'Finaliza un simulacro cronometrado con evaluación integral.',
    icon: '🚀',
    unlocked: false,
  },
];

export const DEFAULT_STUDY_PLAN: StudyPlanDay[] = [
  {
    dayName: 'Lunes',
    area: 'MATEMATICAS',
    durationMinutes: 30,
    topicTitle: 'Aritmética, porcentajes y regla de tres',
    completed: false,
  },
  {
    dayName: 'Martes',
    area: 'LECTURA_CRITICA',
    durationMinutes: 30,
    topicTitle: 'Tesis y argumentación en textos continuos',
    completed: false,
  },
  {
    dayName: 'Miércoles',
    area: 'CIENCIAS_NATURALES',
    durationMinutes: 30,
    topicTitle: 'Indagación y método científico (Biología/Física)',
    completed: false,
  },
  {
    dayName: 'Jueves',
    area: 'SOCIALES_CIUDADANAS',
    durationMinutes: 30,
    topicTitle: 'Constitución Política y mecanismos de protección',
    completed: false,
  },
  {
    dayName: 'Viernes',
    area: 'INGLES',
    durationMinutes: 30,
    topicTitle: 'Avisos, diálogos y conectores discursivos',
    completed: false,
  },
  {
    dayName: 'Sábado',
    area: 'SIMULACRO',
    durationMinutes: 60,
    topicTitle: 'Simulacro general contrarreloj (todas las áreas)',
    completed: false,
  },
  {
    dayName: 'Domingo',
    area: 'REPASO_ERRORES',
    durationMinutes: 30,
    topicTitle: 'Repetición espaciada y banco de errores',
    completed: false,
  },
];

export const createNewUserProfile = (
  email: string,
  fullName?: string,
  curso?: '10°' | '11°' | 'Graduado / Preicfes'
): UserProfile => ({
  name: fullName && fullName.trim().length > 0 ? fullName.trim() : (email.split('@')[0] || 'Estudiante'),
  curso: curso || '11°',
  institucion: '',
  ciudad: '',
  fechaExamen: '2026-08-16',
  metaPuntaje: 380,
  tiempoDiarioMinutos: 30,
  areasDificiles: [],
  diagnosticoCompletado: false,
  xp: 0,
  level: 1,
  streakDays: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyGoalQuestions: 15,
  questionsAnsweredToday: 0,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  achievements: INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, progress: 0 })),
  studyPlan: DEFAULT_STUDY_PLAN.map((d) => ({ ...d, completed: false })),
  mistakes: [],
  practiceHistory: [],
  mockHistory: [],
  subscriptionPlan: 'free',
  email: email,
  isAuthenticated: true,
});

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
}

export type ViewType =
  | 'home'
  | 'diagnostic'
  | 'practice_select'
  | 'practice_session'
  | 'mock_select'
  | 'mock_exam'
  | 'mock_result'
  | 'progress'
  | 'learn'
  | 'learn_topic'
  | 'mistakes'
  | 'study_plan'
  | 'tutor'
  | 'profile'
  | 'pricing'
  | 'auth'
  | 'admin';

interface AppContextType {
  profile: UserProfile | null;
  isAuthLoading: boolean;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
  login: (email: string, name?: string, grade?: '10°' | '11°' | 'Graduado / Preicfes') => void;
  logout: () => void;
  activePracticeParams: {
    type: 'rapida' | 'normal' | 'intensiva' | 'tema' | 'errores' | 'inteligente';
    area?: SubjectArea;
    topic?: string;
  } | null;
  startPractice: (params: {
    type: 'rapida' | 'normal' | 'intensiva' | 'tema' | 'errores' | 'inteligente';
    area?: SubjectArea;
    topic?: string;
  }) => void;
  activeMockResult: MockExamResult | null;
  setActiveMockResult: (result: MockExamResult | null) => void;
  activeSessionData: {
    sessionId: string;
    answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
    timeElapsed: number;
    subject?: string;
  } | null;
  setActiveSessionData: (
    data: {
      sessionId: string;
      answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
      timeElapsed: number;
      subject?: string;
    } | null
  ) => void;
  selectedLearnTopicId: string | null;
  setSelectedLearnTopicId: (id: string | null) => void;
  tutorSelectedQuestion: Question | null;
  setTutorSelectedQuestion: (q: Question | null) => void;
  isTutorDrawerOpen: boolean;
  setIsTutorDrawerOpen: (open: boolean) => void;
  tutorInitialPrompt: string | null;
  setTutorInitialPrompt: (prompt: string | null) => void;
  openTutorWithPrompt: (question: Question | null, prompt: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addXP: (amount: number, reason?: string) => void;
  recordQuestionAnswer: (
    question: Question,
    selectedOption: 'A' | 'B' | 'C' | 'D',
    sessionType?: string
  ) => void;
  resolveMistake: (questionId: string) => void;
  toggleStudyPlanDay: (dayIndex: number) => void;
  saveMockResult: (result: MockExamResult, isDiagnostic?: boolean) => void;
  generateAutoStudyPlan: (examDate: string, dailyMins: number, weakAreas: SubjectArea[], goal: number) => void;
  resetAllData: () => void;
  triggerConfettiCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pure Supabase authentication state - starts empty/null until Supabase confirms the session
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(ACCESSIBILITY_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load accessibility settings:', e);
    }
    return { fontSize: 'normal', highContrast: false };
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved !== null) {
        return saved === 'dark';
      }
    } catch (e) {
      console.error('Failed to load theme preference:', e);
    }
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark mode class and localStorage
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to apply theme:', e);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const setDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled);
  };

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [activePracticeParams, setActivePracticeParams] = useState<{
    type: 'rapida' | 'normal' | 'intensiva' | 'tema' | 'errores' | 'inteligente';
    area?: SubjectArea;
    topic?: string;
  } | null>(null);

  const [activeMockResult, setActiveMockResult] = useState<MockExamResult | null>(null);
  const [activeSessionData, setActiveSessionData] = useState<{
    sessionId: string;
    answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
    timeElapsed: number;
    subject?: string;
  } | null>(null);
  const [selectedLearnTopicId, setSelectedLearnTopicId] = useState<string | null>(null);
  const [tutorSelectedQuestion, setTutorSelectedQuestion] = useState<Question | null>(null);
  const [isTutorDrawerOpen, setIsTutorDrawerOpen] = useState(false);
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | null>(null);

  const openTutorWithPrompt = (question: Question | null, prompt: string) => {
    if (question) {
      setTutorSelectedQuestion(question);
    }
    setTutorInitialPrompt(prompt);
    setIsTutorDrawerOpen(true);
  };

  // Sync accessibility to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(accessibility));
    } catch (e) {
      console.error('Failed to save accessibility:', e);
    }
  }, [accessibility]);

  // Helper function to sync a real Supabase user with isolated persistent storage and profiles table
  const syncUserSession = async (user: any) => {
    const userStorageKey = `icfes_master_user_${user.id}`;
    let existingProfile: UserProfile | null = null;
    try {
      const raw = localStorage.getItem(userStorageKey);
      if (raw) {
        existingProfile = JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading user storage:', e);
    }

    const realFullName = user.user_metadata?.full_name || user.user_metadata?.name;
    const realCurso = user.user_metadata?.curso;
    const userEmail = user.email || '';

    // Consultar tabla profiles de Supabase
    let dbProfile: any = null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!error && data) {
        dbProfile = data;
      }
    } catch (err) {
      console.warn('Nota: perfil en Supabase no disponible aún:', err);
    }

    // Consultar tabla user_mistakes de Supabase
    let dbMistakes: any[] = [];
    try {
      const { data, error } = await supabase
        .from('user_mistakes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        dbMistakes = data;
      }
    } catch (err) {
      console.warn('Nota: user_mistakes en Supabase no disponible aún:', err);
    }

    // Consultar tabla subscriptions de Supabase
    let dbSubscription: any = null;
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        dbSubscription = data;
      }
    } catch (err) {
      console.warn('Nota: subscriptions en Supabase no disponible aún:', err);
    }

    const isSubPremium =
      dbSubscription?.plan_type?.toLowerCase().includes('premium') &&
      (dbSubscription?.status === 'active' || dbSubscription?.status === 'trialing');

    const mappedDbMistakes: UserMistake[] = dbMistakes.map((m) => ({
      questionId: m.question_id,
      area: m.subject as SubjectArea,
      tema: m.subject,
      timestamp: new Date(m.created_at).getTime(),
      userAnswer: m.user_answer as 'A' | 'B' | 'C' | 'D',
      correctAnswer: m.correct_answer as 'A' | 'B' | 'C' | 'D',
      status: m.is_resolved ? 'mastered' : 'pending',
      reviewCount: m.is_resolved ? 2 : 0,
    }));

    if (existingProfile) {
      // Merge mistakes from DB with local mistakes avoiding duplicates
      const mergedMistakes = [...existingProfile.mistakes];
      mappedDbMistakes.forEach((dbM) => {
        const found = mergedMistakes.find((em) => em.questionId === dbM.questionId);
        if (!found) {
          mergedMistakes.push(dbM);
        } else if (dbM.status === 'mastered') {
          found.status = 'mastered';
        }
      });

      const updated: UserProfile = {
        ...existingProfile,
        email: userEmail,
        name: dbProfile?.full_name || realFullName || existingProfile.name || (userEmail.split('@')[0] || 'Estudiante'),
        curso: realCurso || existingProfile.curso || '11°',
        xp: dbProfile?.xp !== undefined ? dbProfile.xp : existingProfile.xp,
        level: dbProfile?.level !== undefined ? dbProfile.level : existingProfile.level,
        streakDays: dbProfile?.streak_days !== undefined ? dbProfile.streak_days : existingProfile.streakDays,
        lastActiveDate: dbProfile?.last_study_date || existingProfile.lastActiveDate,
        subscriptionPlan: isSubPremium
          ? 'premium'
          : dbSubscription
          ? 'free'
          : existingProfile.subscriptionPlan || 'free',
        subscriptionExpiry: dbSubscription?.current_period_end || existingProfile.subscriptionExpiry,
        mistakes: mergedMistakes,
        isAuthenticated: true,
      };
      setProfile(updated);
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving updated profile:', e);
      }
    } else {
      // New registered user starts dynamically from ZERO (0 XP, 0 racha, Nivel 1) or from profiles table
      const fresh = createNewUserProfile(
        userEmail,
        dbProfile?.full_name || realFullName,
        realCurso
      );
      if (dbProfile) {
        fresh.xp = dbProfile.xp ?? 0;
        fresh.level = dbProfile.level ?? 1;
        fresh.streakDays = dbProfile.streak_days ?? 0;
        if (dbProfile.last_study_date) {
          fresh.lastActiveDate = dbProfile.last_study_date;
        }
      }
      if (dbSubscription) {
        fresh.subscriptionPlan = isSubPremium ? 'premium' : 'free';
        if (dbSubscription.current_period_end) {
          fresh.subscriptionExpiry = dbSubscription.current_period_end;
        }
      }
      if (mappedDbMistakes.length > 0) {
        fresh.mistakes = mappedDbMistakes;
      }
      setProfile(fresh);
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(fresh));
      } catch (e) {
        console.error('Error saving fresh profile:', e);
      }
    }
  };

  // Connect to Supabase Auth: listen for real sessions and changes
  useEffect(() => {
    // Clean up any obsolete demo data
    try {
      localStorage.removeItem('icfes_master_profile_v1');
    } catch (e) {
      // ignore
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          syncUserSession(session.user);
        } else {
          setProfile(null);
        }
        setIsAuthLoading(false);
      })
      .catch((err) => {
        console.warn('Supabase getSession error:', err);
        setProfile(null);
        setIsAuthLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncUserSession(session.user);
      } else if (_event === 'SIGNED_OUT') {
        setProfile(null);
        setCurrentView('auth');
      }
      setIsAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Save current profile to Supabase user storage
  useEffect(() => {
    if (profile) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.id) {
          try {
            localStorage.setItem(`icfes_master_user_${session.user.id}`, JSON.stringify(profile));
          } catch (e) {
            console.error('Failed to save profile:', e);
          }
        }
      });
    }
  }, [profile]);

  // Check and update study streak based on current date
  useEffect(() => {
    if (!profile) return;
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate !== today) {
      const lastDate = new Date(profile.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        // Consecutive day
        const newStreak = profile.streakDays + 1;
        setProfile((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            streakDays: newStreak,
            lastActiveDate: today,
            questionsAnsweredToday: 0,
          };
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user?.id) {
            supabase
              .from('profiles')
              .update({
                streak_days: newStreak,
                last_study_date: today,
              })
              .eq('id', session.user.id)
              .then(() => {});
          }
        });
      } else if (diffDays > 1) {
        // Broken streak, restart
        setProfile((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            streakDays: 1,
            lastActiveDate: today,
            questionsAnsweredToday: 0,
          };
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user?.id) {
            supabase
              .from('profiles')
              .update({
                streak_days: 1,
                last_study_date: today,
              })
              .eq('id', session.user.id)
              .then(() => {});
          }
        });
      }
    }
  }, [profile?.lastActiveDate]);

  const triggerConfettiCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
    } catch (err) {
      console.warn('Confetti error:', err);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const addXP = (amount: number, reason?: string) => {
    setProfile((prev) => {
      if (!prev) return null;
      const newXP = prev.xp + amount;
      const newLevel = Math.max(1, Math.floor(Math.sqrt(newXP / 40)) + 1);
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        triggerConfettiCelebration();
      }

      // Sincronizar en la tabla profiles de Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.id) {
          const today = new Date().toISOString().split('T')[0];
          supabase
            .from('profiles')
            .upsert(
              {
                id: session.user.id,
                full_name: prev.name,
                xp: newXP,
                level: newLevel,
                streak_days: prev.streakDays,
                last_study_date: today,
              },
              { onConflict: 'id' }
            )
            .then(({ error }) => {
              if (error) console.warn('Nota sync profiles en addXP:', error.message);
            });
        }
      });

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
  };

  const recordQuestionAnswer = (
    question: Question,
    selectedOption: 'A' | 'B' | 'C' | 'D',
    sessionType: string = 'general'
  ) => {
    const isCorrect = selectedOption === question.respuestaCorrecta;
    const xpGained = isCorrect ? 15 : 3;

    setProfile((prev) => {
      if (!prev) return null;
      const newAnsweredToday = prev.questionsAnsweredToday + 1;
      const newTotalAnswered = prev.totalQuestionsAnswered + 1;
      const newTotalCorrect = isCorrect ? prev.totalCorrectAnswers + 1 : prev.totalCorrectAnswers;

      // Handle mistakes bank
      let newMistakes = [...prev.mistakes];
      if (!isCorrect) {
        const existingIdx = newMistakes.findIndex((m) => m.questionId === question.id);
        if (existingIdx >= 0) {
          newMistakes[existingIdx] = {
            ...newMistakes[existingIdx],
            userAnswer: selectedOption,
            timestamp: Date.now(),
            status: 'pending',
            reviewCount: newMistakes[existingIdx].reviewCount + 1,
          };
        } else {
          newMistakes.unshift({
            questionId: question.id,
            area: question.area,
            tema: question.tema,
            timestamp: Date.now(),
            userAnswer: selectedOption,
            correctAnswer: question.respuestaCorrecta,
            status: 'pending',
            reviewCount: 0,
          });
        }

        // Sincronizar inserción en tabla user_mistakes de Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user?.id) {
            const explanationText =
              typeof question.explicacion === 'string'
                ? question.explicacion
                : question.explicacion?.porQue
                ? `${question.explicacion.porQue} | ${question.explicacion.aprendeEsto || ''}`
                : '';

            supabase
              .from('user_mistakes')
              .insert({
                user_id: session.user.id,
                question_id: question.id,
                subject: question.area,
                question_text: question.pregunta,
                user_answer: selectedOption,
                correct_answer: question.respuestaCorrecta,
                ai_explanation: explanationText,
                is_resolved: false,
              })
              .then(({ error }) => {
                if (error) console.warn('Nota sync user_mistakes insert:', error.message);
              });
          }
        });
      }

      // Add practice session log
      const newPracticeHistory = [
        {
          id: `sess-${Date.now()}`,
          type: sessionType as any,
          area: question.area,
          totalQuestions: 1,
          correctAnswers: isCorrect ? 1 : 0,
          timeSpentSeconds: 60,
          timestamp: Date.now(),
          xpEarned: xpGained,
        },
        ...prev.practiceHistory,
      ].slice(0, 50);

      // Check achievement triggers
      const updatedAchievements = prev.achievements.map((ach) => {
        if (ach.id === 'first_practice' && !ach.unlocked) {
          return { ...ach, unlocked: true, unlockedAt: Date.now(), progress: 1 };
        }
        if (ach.id === 'questions_100') {
          const p = Math.min(100, newTotalAnswered);
          return { ...ach, progress: p, unlocked: p >= 100 };
        }
        return ach;
      });

      const newXP = prev.xp + xpGained;
      const newLevel = Math.max(1, Math.floor(Math.sqrt(newXP / 40)) + 1);

      return {
        ...prev,
        questionsAnsweredToday: newAnsweredToday,
        totalQuestionsAnswered: newTotalAnswered,
        totalCorrectAnswers: newTotalCorrect,
        xp: newXP,
        level: newLevel,
        mistakes: newMistakes,
        practiceHistory: newPracticeHistory,
        achievements: updatedAchievements,
      };
    });
  };

  const resolveMistake = (questionId: string) => {
    setProfile((prev) => {
      if (!prev) return null;
      const updated = prev.mistakes.map((m) =>
        m.questionId === questionId ? { ...m, status: 'mastered' as const } : m
      );
      return { ...prev, mistakes: updated };
    });

    // Actualizar resolución en Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        supabase
          .from('user_mistakes')
          .update({ is_resolved: true })
          .eq('user_id', session.user.id)
          .eq('question_id', questionId)
          .then(({ error }) => {
            if (error) console.warn('Nota sync user_mistakes resolve:', error.message);
          });
      }
    });

    addXP(20, 'Concepto dominado en banco de errores');
  };

  const toggleStudyPlanDay = (dayIndex: number) => {
    setProfile((prev) => {
      if (!prev) return null;
      const newPlan = [...prev.studyPlan];
      if (newPlan[dayIndex]) {
        newPlan[dayIndex] = {
          ...newPlan[dayIndex],
          completed: !newPlan[dayIndex].completed,
        };
      }
      return { ...prev, studyPlan: newPlan };
    });
  };

  const saveMockResult = (result: MockExamResult, isDiagnostic = false) => {
    setProfile((prev) => {
      if (!prev) return null;
      const newHistory = [result, ...prev.mockHistory];
      const xpBonus = Math.round(result.globalScoreScaled * 0.8);
      const newXP = prev.xp + xpBonus;
      const newLevel = Math.max(1, Math.floor(Math.sqrt(newXP / 40)) + 1);

      return {
        ...prev,
        mockHistory: newHistory,
        diagnosticoCompletado: isDiagnostic ? true : prev.diagnosticoCompletado,
        diagnosticResult: isDiagnostic ? result : prev.diagnosticResult,
        xp: newXP,
        level: newLevel,
      };
    });
    triggerConfettiCelebration();
  };

  const generateAutoStudyPlan = (
    examDate: string,
    dailyMins: number,
    weakAreas: SubjectArea[],
    goal: number
  ) => {
    const days: Array<{
      day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
      area: SubjectArea | 'SIMULACRO' | 'REPASO_ERRORES';
      topic: string;
    }> = [
      {
        day: 'Lunes',
        area: weakAreas[0] || 'MATEMATICAS',
        topic: 'Refuerzo prioritario de área débil y resolución de preguntas',
      },
      {
        day: 'Martes',
        area: 'LECTURA_CRITICA',
        topic: 'Análisis de textos filosóficos, premisas e inferencias',
      },
      {
        day: 'Miércoles',
        area: weakAreas[1] || 'CIENCIAS_NATURALES',
        topic: 'Indagación científica, variables experimentales y física/química',
      },
      {
        day: 'Jueves',
        area: 'SOCIALES_CIUDADANAS',
        topic: 'Constitución Política, competencias ciudadanas y derechos',
      },
      {
        day: 'Viernes',
        area: 'INGLES',
        topic: 'Lectura inferencial B1, conectores temporales y vocabulario',
      },
      {
        day: 'Sábado',
        area: 'SIMULACRO',
        topic: 'Simulacro contrarreloj (evaluación integral con tiempo ICFES)',
      },
      {
        day: 'Domingo',
        area: 'REPASO_ERRORES',
        topic: 'Cuaderno inteligente de errores y retroalimentación con Tutor IA',
      },
    ];

    const customizedPlan: StudyPlanDay[] = days.map((d) => ({
      dayName: d.day,
      area: d.area,
      durationMinutes: d.area === 'SIMULACRO' ? Math.max(60, dailyMins * 2) : dailyMins,
      topicTitle: d.topic,
      completed: false,
    }));

    updateProfile({
      fechaExamen: examDate,
      tiempoDiarioMinutos: dailyMins,
      areasDificiles: weakAreas,
      metaPuntaje: goal,
      studyPlan: customizedPlan,
    });
  };

  const startPractice = (params: {
    type: 'rapida' | 'normal' | 'intensiva' | 'tema' | 'errores' | 'inteligente';
    area?: SubjectArea;
    topic?: string;
  }) => {
    setActivePracticeParams(params);
    setCurrentView('practice_session');
  };

  const resetAllData = () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const fresh = createNewUserProfile(
          session.user.email || '',
          session.user.user_metadata?.full_name,
          session.user.user_metadata?.curso
        );
        setProfile(fresh);
        try {
          localStorage.setItem(`icfes_master_user_${session.user.id}`, JSON.stringify(fresh));
        } catch (e) {
          console.error('Error resetting user storage:', e);
        }
      } else {
        setProfile(null);
      }
      setCurrentView('home');
    });
  };

  const login = (_email: string, _name?: string, _grade?: '10°' | '11°' | 'Graduado / Preicfes') => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncUserSession(session.user);
        triggerConfettiCelebration();
        setCurrentView('home');
      } else {
        setCurrentView('auth');
      }
    });
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }
    setProfile(null);
    setCurrentView('auth');
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        isAuthLoading,
        currentView,
        setCurrentView,
        accessibility,
        setAccessibility,
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
        login,
        logout,
        activePracticeParams,
        startPractice,
        activeMockResult,
        setActiveMockResult,
        activeSessionData,
        setActiveSessionData,
        selectedLearnTopicId,
        setSelectedLearnTopicId,
        tutorSelectedQuestion,
        setTutorSelectedQuestion,
        isTutorDrawerOpen,
        setIsTutorDrawerOpen,
        tutorInitialPrompt,
        setTutorInitialPrompt,
        openTutorWithPrompt,
        updateProfile,
        addXP,
        recordQuestionAnswer,
        resolveMistake,
        toggleStudyPlanDay,
        saveMockResult,
        generateAutoStudyPlan,
        resetAllData,
        triggerConfettiCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
