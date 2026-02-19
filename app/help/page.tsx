"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { HelpCircle, Upload, CheckCircle, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

const helpSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type HelpFormData = z.infer<typeof helpSchema>;

export default function HelpPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HelpFormData>({
    resolver: zodResolver(helpSchema),
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const onSubmit = async (data: HelpFormData) => {
    if (!user) return;

    setUploading(true);

    try {
      let screenshotUrl = "";

      if (screenshot) {
        const storageRef = ref(storage, `help-screenshots/${user.uid}/${Date.now()}_${screenshot.name}`);
        await uploadBytes(storageRef, screenshot);
        screenshotUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "helpRequests"), {
        userId: user.uid,
        userName: user.displayName || "Student",
        userEmail: user.email || "",
        message: data.message,
        screenshotUrl,
        status: "pending",
        timestamp: new Date(),
      });

      setSubmitted(true);
      reset();
      setScreenshot(null);

      setTimeout(() => {
        router.push("/lessons");
      }, 3000);
    } catch (error) {
      console.error("Error submitting help request:", error);
      alert("Failed to submit help request. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-limeGreen via-skyBlue to-sunnyYellow">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="border-4 border-black bg-white">
              <CardContent className="p-12">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex justify-center mb-6"
                >
                  <CheckCircle className="w-24 h-24 text-limeGreen" />
                </motion.div>
                <h2 className="text-4xl font-bold font-comic mb-4">
                  Help Request Sent!
                </h2>
                <p className="text-xl font-comic text-gray-600">
                  Thank you! We'll get back to you soon.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
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
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center mb-4"
          >
            <HelpCircle className="w-20 h-20 text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold font-bubblegum text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4">
            Need Help?
          </h1>
          <p className="text-2xl font-comic text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
            Tell us what's going on and we'll help you out!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-4 border-black">
            <CardHeader className="bg-gradient-to-r from-skyBlue to-limeGreen text-white">
              <CardTitle className="text-3xl drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                Help Request Form
              </CardTitle>
              <CardDescription className="text-white text-lg">
                Describe your problem and we'll assist you
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="message">What do you need help with?</Label>
                  <textarea
                    id="message"
                    {...register("message")}
                    className="flex w-full rounded-xl border-4 border-black bg-white px-4 py-3 text-lg font-comic shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-skyBlue min-h-[150px]"
                    placeholder="Tell us what problem you're facing..."
                  />
                  {errors.message && (
                    <p className="text-brightRed font-comic font-bold">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot">Upload a Screenshot (Optional)</Label>
                  <div className="relative">
                    <Input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {screenshot && (
                      <p className="mt-2 text-sm font-comic text-limeGreen font-bold">
                        File selected: {screenshot.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-skyBlue/20 border-4 border-black rounded-2xl p-4">
                  <p className="font-comic text-lg">
                    <strong>Your info:</strong>
                  </p>
                  <p className="font-comic">Name: {user.displayName || "Student"}</p>
                  <p className="font-comic">Email: {user.email}</p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Star className="w-5 h-5" />
                      </motion.div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Send Help Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
