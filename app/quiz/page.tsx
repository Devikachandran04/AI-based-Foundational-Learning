"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useQuizStore } from "@/stores/quizStore";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import DraggableQuiz from "@/components/DraggableQuiz";

export default function QuizPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const {
    currentQuestionIndex,
    questions,
    userAnswer,
    isAnswerChecked,
    answers,
    setUserAnswer,
    checkAnswer,
    nextQuestion,
    resetQuiz,
  } = useQuizStore();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    resetQuiz();
  }, [resetQuiz]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sunnyYellow via-skyBlue to-limeGreen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Star className="w-16 h-16 text-white" />
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);
  const isCorrect = currentAnswer?.isCorrect || false;

  const handleCheckAnswer = () => {
    if (!userAnswer) {
      alert("Please drag the ball to a position first!");
      return;
    }
    checkAnswer();
  };

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      router.push("/results");
    } else {
      nextQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyBlue via-limeGreen to-sunnyYellow">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="bg-white px-6 py-3 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl font-bold font-comic">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            <div className="bg-white px-6 py-3 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl font-bold font-comic">
                Score: {answers.filter((a) => a.isCorrect).length} / {questions.length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
            <DraggableQuiz
              key={currentQuestion.id}
              questionId={currentQuestion.id}
              question={currentQuestion.question}
              correctAnswer={currentQuestion.correctAnswer}
              onAnswer={setUserAnswer}
              isAnswerChecked={isAnswerChecked}
              isCorrect={isCorrect}
            />

            <div className="mt-8 flex justify-center gap-4">
              {!isAnswerChecked ? (
                <Button
                  size="lg"
                  onClick={handleCheckAnswer}
                  disabled={!userAnswer}
                  className="text-xl px-12"
                >
                  Check Answer
                </Button>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Button
                    size="lg"
                    variant="success"
                    onClick={handleNext}
                    className="text-xl px-12"
                  >
                    {currentQuestionIndex === questions.length - 1
                      ? "See Results"
                      : "Next Question"}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
