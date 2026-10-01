export type SubjectArea =
  | 'MATEMATICAS'
  | 'LECTURA_CRITICA'
  | 'CIENCIAS_NATURALES'
  | 'SOCIALES_CIUDADANAS'
  | 'INGLES';

export type DifficultyLevel = 'Básica' | 'Intermedia' | 'Avanzada' | 'Media';

export interface QuestionExplanation {
  porQue: string;
  aprendeEsto: string;
  errorFrecuente: string;
  consejoIcfes: string;
}

export interface Question {
  id: string;
  area: SubjectArea;
  tema: string;
  subtema: string;
  competencia: string;
  dificultad: DifficultyLevel;
  contexto?: string; // Situación problema, texto de lectura, tabla o descripción de gráfica
  graficoHtml?: string; // Representación visual esquemática / tabla
  pregunta: string;
  opciones: [string, string, string, string]; // [A, B, C, D]
  respuestaCorrecta: 'A' | 'B' | 'C' | 'D';
  explicacion: QuestionExplanation;
}

export interface UserMistake {
  questionId: string;
  area: SubjectArea;
  tema: string;
  timestamp: number;
  userAnswer: 'A' | 'B' | 'C' | 'D';
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  status: 'pending' | 'reviewed' | 'mastered';
  reviewCount: number;
}

export interface PracticeSession {
  id: string;
  type: 'rapida' | 'normal' | 'intensiva' | 'tema' | 'errores' | 'inteligente';
  area?: SubjectArea;
  topic?: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSeconds: number;
  timestamp: number;
  xpEarned: number;
}

export interface MockExamResult {
  id: string;
  timestamp: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeUsedSeconds: number;
  timeLimitSeconds: number;
  globalScoreScaled: number; // 0 to 500 points
  globalPercentage: number;
  areaBreakdown: Record<SubjectArea, {
    total: number;
    correct: number;
    percentage: number;
  }>;
  weakCompetencies: string[];
  recommendations: string[];
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
}

export interface StudyPlanDay {
  dayName: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  area: SubjectArea | 'SIMULACRO' | 'REPASO_ERRORES';
  durationMinutes: number;
  topicTitle: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

export interface UserProfile {
  name: string;
  curso: '10°' | '11°' | 'Graduado / Preicfes';
  institucion?: string;
  ciudad?: string;
  fechaExamen: string;
  metaPuntaje: number;
  tiempoDiarioMinutos: number;
  areasDificiles: SubjectArea[];
  diagnosticoCompletado: boolean;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyGoalQuestions: number;
  questionsAnsweredToday: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  achievements: Achievement[];
  studyPlan: StudyPlanDay[];
  mistakes: UserMistake[];
  practiceHistory: PracticeSession[];
  mockHistory: MockExamResult[];
  diagnosticResult?: MockExamResult;
  subscriptionPlan?: 'free' | 'premium';
  subscriptionExpiry?: string;
  email?: string;
  isAuthenticated?: boolean;
}

export interface EasyExplanation {
  analogia: string;
  pasos: string[];
  comparacion: string;
  miniEjercicio: string;
}

export interface LearningTopic {
  id: string;
  area: SubjectArea;
  titulo: string;
  subtitulo: string;
  icono: string;
  resumenTeorico: string;
  clavesYFormulas: string[];
  ejemploIcfes: {
    enunciado: string;
    opciones: string[];
    solucionPasoAPaso: string[];
    respuestaCorrecta: string;
    porQue: string;
  };
  erroresComunes: string[];
  miniQuizPreguntaId?: string;
}
