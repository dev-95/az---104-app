export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

// Represents the overall state of the application flow
export type GameState = 'login' | 'dashboard' | 'practice-start' | 'exam-start' | 'loading' | 'quiz' | 'results' | 'account';

// The two main modes of the app
export type AppMode = 'practice' | 'exam';

// Fix: Add missing QuizMode type. This defines the types of quizzes that can be started.
export type QuizMode = 'daily' | 'topic' | 'quick';

export interface UserStats {
  totalCorrect: number;
  totalAnswered: number;
  topicStats: Record<string, { totalCorrect: number; totalAnswered: number }>;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface UserAnswer {
    question: QuizQuestion;
    selectedAnswerIndex: number;
    isCorrect: boolean;
}