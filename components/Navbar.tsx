"use client";

import { useAuthStore } from "@/stores/authStore";
import { useQuizStore } from "@/stores/quizStore";
import { Button } from "@/components/ui/button";
import { HelpCircle, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { currentQuestionIndex, questions } = useQuizStore();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    logout();
    router.push("/");
  };

  const handleHelpClick = () => {
    router.push("/help");
  };

  const progress = questions.length > 0
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-gradient-to-r from-brightRed via-sunnyYellow to-skyBlue border-b-4 border-black shadow-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
            onClick={() => router.push(user ? "/lessons" : "/")}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-bubblegum text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              PrepositionPal
            </h1>
          </motion.div>

          {user && (
            <div className="flex items-center gap-4">
              {progress > 0 && (
                <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-sm font-comic font-bold">Progress:</span>
                  <div className="w-32 h-3 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-limeGreen"
                    />
                  </div>
                  <span className="text-sm font-comic font-bold">{Math.round(progress)}%</span>
                </div>
              )}

              <Button
                variant="warning"
                size="sm"
                onClick={handleHelpClick}
                className="flex items-center gap-2"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden md:inline">Help</span>
              </Button>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full border-2 border-black"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-skyBlue border-2 border-black flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="hidden md:inline font-comic font-bold text-sm">
                  {user.displayName || "Student"}
                </span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                className="hidden md:flex"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
