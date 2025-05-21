"use client";

import { useEffect, useState } from "react";
import RadialTaxonomy from "./_radial-component";
import { Lock, LogIn, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const TIMER_DURATION = 5 * 60; // 5 minutes in seconds

export default function RadialWithTimer() {
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we already had a session started
    const sessionStartTime = localStorage.getItem("anonymousSessionStart");

    if (sessionStartTime) {
      const elapsedSeconds = Math.floor((Date.now() - parseInt(sessionStartTime)) / 1000);
      const remainingTime = Math.max(0, TIMER_DURATION - elapsedSeconds);

      if (remainingTime <= 0) {
        setShowLoginPrompt(true);
        return;
      }

      setTimeRemaining(remainingTime);
    } else {
      // Start a new session
      localStorage.setItem("anonymousSessionStart", Date.now().toString());
    }

    // Set up the timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowLoginPrompt(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (showLoginPrompt) {
    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-teal-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-teal-800 mb-2">Waktu Akses Habis</h3>
          <p className="text-neutral-600 mb-6">
            Waktu akses gratis Anda telah berakhir. Untuk terus menjelajahi visualisasi radial Felidae,
            silakan login untuk akses penuh.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleLogin}>
              <LogIn className="h-4 w-4 mr-2" />
              Login Sekarang
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 bg-white/90 shadow-md rounded-full px-4 py-2 flex items-center gap-2 z-10 border border-amber-200">
        <Clock className="h-4 w-4 text-amber-600" />
        <span className="font-medium text-sm">
          Akses gratis: {formatTime(timeRemaining)}
        </span>
      </div>
      <RadialTaxonomy userID="anonymous" />
    </div>
  );
}