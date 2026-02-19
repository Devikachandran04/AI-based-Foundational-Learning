"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ClassSelectPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleClassSelect = async (classLevel: 7 | 8) => {
    if (!user) return;

    setSelecting(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        selectedClass: classLevel,
      });
      router.push("/lessons");
    } catch (error) {
      console.error("Error selecting class:", error);
    } finally {
      setSelecting(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-limeGreen via-skyBlue to-sunnyYellow">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-bubblegum text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4">
            Choose Your Class
          </h1>
          <p className="text-2xl font-comic text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
            Select your grade level to start learning!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, rotate: -2 }}
          >
            <Card className="cursor-pointer h-full bg-gradient-to-br from-brightRed to-sunnyYellow">
              <CardHeader className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex justify-center mb-4"
                >
                  <BookOpen className="w-24 h-24 text-white drop-shadow-lg" />
                </motion.div>
                <CardTitle className="text-5xl text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  Class 7
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                  Perfect for beginners!
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-left space-y-2 mb-6 text-white font-comic text-lg">
                  <li className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Basic prepositions
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Fun drag-and-drop games
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Interactive lessons
                  </li>
                </ul>
                <Button
                  size="lg"
                  onClick={() => handleClassSelect(7)}
                  disabled={selecting}
                  className="w-full bg-white text-brightRed hover:bg-gray-100"
                >
                  {selecting ? "Loading..." : "Start Class 7"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <Card className="cursor-pointer h-full bg-gradient-to-br from-skyBlue to-limeGreen">
              <CardHeader className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="flex justify-center mb-4"
                >
                  <BookOpen className="w-24 h-24 text-white drop-shadow-lg" />
                </motion.div>
                <CardTitle className="text-5xl text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  Class 8
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                  Ready for more challenges!
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-left space-y-2 mb-6 text-white font-comic text-lg">
                  <li className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Advanced prepositions
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Complex sentences
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Real-world examples
                  </li>
                </ul>
                <Button
                  size="lg"
                  onClick={() => handleClassSelect(8)}
                  disabled={selecting}
                  className="w-full bg-white text-skyBlue hover:bg-gray-100"
                >
                  {selecting ? "Loading..." : "Start Class 8"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
