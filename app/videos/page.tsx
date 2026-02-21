"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Video } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function VideosPage() {
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

  const videos = [
    {
      id: 1,
      title: "Prepositions of Place - In, On, Under",
      description: "Learn the basics of prepositions with fun examples!",
      url: "https://www.youtube.com/embed/QYerFOnPxu8",
      thumbnail: "https://i.ytimg.com/vi/QYerFOnPxu8/hqdefault.jpg",
    },
    {
      id: 2,
      title: "Prepositions Song for Kids",
      description: "A catchy song to help you remember prepositions!",
      url: "https://www.youtube.com/embed/xyMrLQ4ZI-4",
      thumbnail: "https://i.ytimg.com/vi/xyMrLQ4ZI-4/hqdefault.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyBlue via-limeGreen to-sunnyYellow">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center mb-4"
          >
            <Video className="w-20 h-20 text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold font-bubblegum text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4">
            Learning Videos
          </h1>
          <p className="text-2xl font-comic text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
            Watch these fun videos to learn more about prepositions!
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="overflow-hidden h-full">
                <CardHeader className="bg-gradient-to-r from-brightRed to-sunnyYellow text-white">
                  <CardTitle className="text-2xl drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                    {video.title}
                  </CardTitle>
                  <CardDescription className="text-white text-lg">
                    {video.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={video.url}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-limeGreen to-skyBlue border-4 border-black">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold font-comic text-white mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                Ready to try again?
              </h3>
              <p className="text-xl font-comic text-white mb-6">
                After watching these videos, you'll do even better!
              </p>
              <Button
                size="lg"
                onClick={() => router.push("/quiz")}
                className="bg-white text-brightRed hover:bg-gray-100"
              >
                Take Quiz Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
