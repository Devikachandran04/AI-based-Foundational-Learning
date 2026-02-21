"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Play, Star, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LessonsPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
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
    <div className="min-h-screen bg-gradient-to-br from-sunnyYellow via-brightRed to-skyBlue">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-bubblegum text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4">
            English Grammar
          </h1>
          <p className="text-2xl font-comic text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
            Choose a lesson to begin your adventure!
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-limeGreen rounded-2xl p-4 border-4 border-black"
                    >
                      <BookOpen className="w-12 h-12 text-white" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-3xl mb-2">
                        Prepositions of Place - Level 1
                      </CardTitle>
                      <CardDescription className="text-lg">
                        Learn where things are: on, in, under, beside, above
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Star className="w-6 h-6 text-sunnyYellow fill-sunnyYellow" />
                    <Star className="w-6 h-6 text-sunnyYellow fill-sunnyYellow" />
                    <Star className="w-6 h-6 text-sunnyYellow fill-sunnyYellow" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="font-comic text-lg">
                      <span className="font-bold">Duration:</span> 10 minutes
                    </p>
                    <p className="font-comic text-lg">
                      <span className="font-bold">Questions:</span> 2
                    </p>
                    <p className="font-comic text-lg">
                      <span className="font-bold">Type:</span> Drag & Drop
                    </p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      onClick={() => router.push("/quiz")}
                      className="flex items-center gap-3"
                    >
                      <Play className="w-6 h-6" />
                      Start Quiz
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gray-100 opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-400 rounded-2xl p-4 border-4 border-black">
                      <Lock className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl mb-2 text-gray-600">
                        Prepositions of Time - Level 2
                      </CardTitle>
                      <CardDescription className="text-lg">
                        Coming soon! Master when things happen.
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button size="lg" disabled className="bg-gray-400">
                  <Lock className="w-5 h-5 mr-2" />
                  Locked
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gray-100 opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-400 rounded-2xl p-4 border-4 border-black">
                      <Lock className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl mb-2 text-gray-600">
                        Prepositions of Movement - Level 3
                      </CardTitle>
                      <CardDescription className="text-lg">
                        Coming soon! Learn how things move.
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button size="lg" disabled className="bg-gray-400">
                  <Lock className="w-5 h-5 mr-2" />
                  Locked
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
