"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Star } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && user) {
      router.push("/class-select");
    }
  }, [user, loading, router]);

  const handleStartLearning = () => {
    router.push("/login");
  };

  if (loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-sunnyYellow via-skyBlue to-limeGreen relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Star className="w-8 h-8 text-white" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="mb-8"
          >
            <h1 className="text-7xl md:text-9xl font-bold font-bubblegum text-white drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              PrepositionPal
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <p className="text-2xl md:text-4xl font-bold font-comic text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] mb-4">
              Learn English Grammar the Fun Way!
            </p>
            <p className="text-xl md:text-2xl font-comic text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              Master prepositions through exciting games and colorful adventures!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={handleStartLearning}
                className="text-2xl py-8 px-12 flex items-center gap-3"
              >
                <Sparkles className="w-8 h-8" />
                Start Learning
                <Sparkles className="w-8 h-8" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {[
              { icon: BookOpen, title: "Fun Lessons", desc: "Interactive grammar lessons" },
              { icon: Sparkles, title: "Drag & Drop", desc: "Learn by playing games" },
              { icon: Star, title: "Track Progress", desc: "See your improvement" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, rotate: 2 }}
                className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <feature.icon className="w-16 h-16 mx-auto mb-4 text-brightRed" />
                <h3 className="text-2xl font-bold font-comic mb-2">{feature.title}</h3>
                <p className="text-lg font-comic text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
