"use client";

import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { CheckCircle, Sparkles, Zap, AlertTriangle, Clock } from "lucide-react";
import { useState, useEffect } from "react";



export default function ScanStatusApi({ apiChecking, apiReady, response }: {
  apiChecking: boolean;
  apiReady?: boolean;
  response: {
    data: {
      status: string;
    };
  };
}) {
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (apiChecking) {
      interval = setInterval(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);
    } else {
      setWaitTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [apiChecking]);

  const formatWaitTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} detik`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto text-center mb-8 px-4 sm:px-6 lg:px-8"
    >
      <Badge
        variant="secondary"
        className="mb-4 sm:mb-6 text-xs sm:text-sm bg-primary/15 text-primary border border-primary/25"
      >
        AI Scanner Pro
      </Badge>
      <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-2">
        Identifikasi Family Felidae
      </h1>
      <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4 px-0 sm:px-4">
        Unggah gambar atau masukkan URL untuk mengidentifikasi kucing besar dan kecil{" "}
        <span className="text-primary font-medium bg-primary/15 px-2 py-1 rounded-lg border border-primary/20">
          (keluarga Felidae, seperti harimau, singa, kucing rumahan)
        </span>{" "}
        secara instan dengan teknologi AI
      </p>

      <section className="mx-auto ">
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-4">
          <Badge variant="outline" className="bg-card/70 backdrop-blur-sm border-border text-xs md:text-sm text-foreground">
            <Zap className="h-3 w-3 mr-1 text-primary" />
            Akurasi 96%
          </Badge>
          <Badge variant="outline" className="bg-card/70 backdrop-blur-sm border-border text-xs md:text-sm text-foreground">
            <CheckCircle className="h-3 w-3 mr-1 text-primary" />
            30 Spesies
          </Badge>
          <Badge variant="outline" className="bg-card/70 backdrop-blur-sm border-border text-xs md:text-sm text-foreground">
            <Sparkles className="h-3 w-3 mr-1 text-primary" />
            Deep Learning
          </Badge>
        </div>
        <div className="flex justify-center mt-3 px-2">
          {apiChecking ? (
            <div className="flex flex-col items-center gap-2">
              <Badge variant="outline" className="bg-card/70 backdrop-blur-sm border-border text-xs sm:text-sm text-foreground">
                <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse mr-2"></div>
                <Clock className="h-3 w-3 mr-1 text-yellow-500" />
                Memeriksa status API...
              </Badge>
              <div className="text-xs text-muted-foreground text-center">
                <span className="font-medium">Waktu tunggu: {formatWaitTime(waitTime)}</span>
                <p className="mt-1 px-2">
                  Model sedang dimuat, harap tunggu sebentar...
                </p>
              </div>
            </div>
          ) : apiReady ? (
            <Badge variant="outline" className="bg-card/70 backdrop-blur-sm border-border text-xs sm:text-sm text-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              API Model Siap
            </Badge>
          ) : (
            <div className="flex flex-col items-center gap-2 max-w-xs sm:max-w-sm">
              <Badge variant="outline" className="bg-card/70 backdrop-blur-sm border-border text-xs sm:text-sm text-foreground">
                <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
                API Model Tidak Tersedia
              </Badge>
              <p className="text-xs text-muted-foreground text-center px-2">
                Jika masalah berlanjut, silakan hubungi developer untuk bantuan
              </p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}