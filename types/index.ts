export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  selectedClass?: 7 | 8;
  createdAt: Date;
}

export interface QuizQuestion {
  id: number;
  question: string;
  correctAnswer: "on" | "in" | "under" | "beside" | "above";
  imageUrl?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: Answer[];
  timestamp: Date;
  classLevel: 7 | 8;
}

export interface Answer {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface HelpRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  screenshotUrl?: string;
  status: "pending" | "resolved";
  timestamp: Date;
}

export type DropZone = "on" | "in" | "under" | "beside-left" | "beside-right" | "above";

export interface DragItem {
  id: string;
  type: string;
}
