"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useQuizStore } from "@/stores/quizStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Trophy, Video, RotateCcw, Star, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Confetti from "react-confetti";
import { calculateScore, getEncouragingMessage } from "@/lib/utils";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ResultsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const { score, questions, answers, resetQuiz } = useQuizStore();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  const totalScore = calculateScore(score, questions.length);
  const passed = totalScore >= 70;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (passed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [passed]);

  useEffect(() => {
    if (user && answers.length > 0) {
      saveQuizAttempt();
    }
  }, [user, answers]);

  const saveQuizAttempt = async () => {
    if (!user) return;

    try {
      await addDoc(collection(db, "quizAttempts"), {
        userId: user.uid,
        score: totalScore,
        correctAnswers: score,
        totalQuestions: questions.length,
        answers: answers,
        timestamp: new Date(),
        classLevel: user.selectedClass || 7,
      });
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
    }
  };

  const handleTryAgain = () => {
    resetQuiz();
    router.push("/quiz");
  };

  const handleWatchVideos = () => {
    router.push("/videos");
  };

  const handleNextLesson = () => {
    router.push("/lessons");
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-brightRed via-sunnyYellow to-limeGreen">
      {showConfetti && windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-4 border-black">
            <CardHeader className="text-center bg-gradient-to-r from-skyBlue to-limeGreen rounded-t-2xl">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex justify-center mb-4"
              >
                <Trophy className="w-24 h-24 text-sunnyYellow" />
              </motion.div>
              <CardTitle className="text-5xl text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                {passed ? "Awesome Job!" : "Good Try!"}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="inline-block"
                >
                  <div className="text-8xl font-bold font-bubblegum text-transparent bg-clip-text bg-gradient-to-r from-brightRed via-sunnyYellow to-limeGreen">
                    {totalScore}%
                  </div>
                </motion.div>

                <p className="text-2xl font-comic mt-4 text-gray-700">
                  {getEncouragingMessage(totalScore)}
                </p>

                <div className="mt-6 flex justify-center gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-limeGreen">{score}</div>
                    <div className="text-lg font-comic text-gray-600">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-brightRed">
                      {questions.length - score}
                    </div>
                    <div className="text-lg font-comic text-gray-600">Incorrect</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-2xl font-bold font-comic text-center mb-4">
                  Your Answers:
                </h3>
                {answers.map((answer, index) => (
                  <motion.div
                    key={answer.questionId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-2xl border-4 border-black ${
                      answer.isCorrect ? "bg-limeGreen/20" : "bg-brightRed/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold font-comic text-lg">
                          Question {index + 1}:
                        </span>
                        <span className="ml-2 font-comic">
                          Your answer: <strong>{answer.userAnswer}</strong>
                        </span>
                      </div>
                      <div>
                        {answer.isCorrect ? (
                          <span className="text-limeGreen text-2xl">✓</span>
                        ) : (
                          <span className="text-brightRed text-2xl">✗</span>
                        )}
                      </div>
                    </div>
                    {!answer.isCorrect && (
                      <div className="mt-2 text-gray-600 font-comic">
                        Correct answer: <strong>{answer.correctAnswer}</strong>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {passed ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="success"
                      onClick={handleNextLesson}
                      className="flex items-center gap-2"
                    >
                      Next Lesson
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        variant="warning"
                        onClick={handleWatchVideos}
                        className="flex items-center gap-2"
                      >
                        <Video className="w-5 h-5" />
                        Watch Videos
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        variant="secondary"
                        onClick={handleTryAgain}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Try Again
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
