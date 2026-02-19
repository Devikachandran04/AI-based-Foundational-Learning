import { create } from "zustand";
import { QuizQuestion, Answer } from "@/types";

interface QuizState {
  currentQuestionIndex: number;
  questions: QuizQuestion[];
  answers: Answer[];
  score: number;
  isQuizComplete: boolean;
  userAnswer: string | null;
  isAnswerChecked: boolean;
  setQuestions: (questions: QuizQuestion[]) => void;
  setUserAnswer: (answer: string | null) => void;
  checkAnswer: () => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  completeQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentQuestionIndex: 0,
  questions: [
    {
      id: 1,
      question: "The ball is ___ the table.",
      correctAnswer: "on",
    },
    {
      id: 2,
      question: "The ball is ___ the table.",
      correctAnswer: "in",
    },
  ],
  answers: [],
  score: 0,
  isQuizComplete: false,
  userAnswer: null,
  isAnswerChecked: false,

  setQuestions: (questions) => set({ questions }),

  setUserAnswer: (answer) => set({ userAnswer: answer, isAnswerChecked: false }),

  checkAnswer: () => {
    const { questions, currentQuestionIndex, userAnswer, answers } = get();
    const currentQuestion = questions[currentQuestionIndex];

    if (!userAnswer) return;

    const isCorrect = userAnswer === currentQuestion.correctAnswer;
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      userAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    };

    set({
      answers: [...answers, newAnswer],
      score: isCorrect ? get().score + 1 : get().score,
      isAnswerChecked: true,
    });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({
        currentQuestionIndex: currentQuestionIndex + 1,
        userAnswer: null,
        isAnswerChecked: false,
      });
    } else {
      get().completeQuiz();
    }
  },

  completeQuiz: () => set({ isQuizComplete: true }),

  resetQuiz: () =>
    set({
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      isQuizComplete: false,
      userAnswer: null,
      isAnswerChecked: false,
    }),
}));
