"use client";

import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { CheckCircle, Sparkles, Zap, AlertTriangle } from "lucide-react";



export default function ScanStatusApi({ apiChecking, apiReady, response }: {
  apiChecking: boolean;
  apiReady?: boolean;
  response: {
    data: {
      status: string;
    };
  };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto text-center mb-8"
    >
      <Badge
        variant="secondary"
        className="mb-6 text-sm bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300"
      >
        AI Scanner Pro
      </Badge>
      <h1 className="text-4xl md:text-6xl font-bold text-emerald-800 mb-6">Identifikasi Spesies Felidae</h1>
      <p className="text-neutral-600 text-lg md:text-xl leading-relaxed mb-4">
        Unggah gambar atau gunakan URL untuk mengidentifikasi spesies Felidae secara instan dengan teknologi AI
        canggih.
      </p>

      <div className="flex justify-center gap-2 mt-4">
        <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
          <Zap className="h-3 w-3 mr-1 text-emerald-600" />
          Akurasi 98.5%
        </Badge>
        <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
          <CheckCircle className="h-3 w-3 mr-1 text-emerald-600" />
          41 Spesies
        </Badge>
        <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
          <Sparkles className="h-3 w-3 mr-1 text-emerald-600" />
          Deep Learning
        </Badge>
      </div>      <div className="flex justify-center mt-3">
        {apiChecking ? (
          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse mr-2"></div>
            Memeriksa status API...
          </Badge>
        ) : apiReady ? (
          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
            API Model Siap
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
            <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
            API Model Tidak Tersedia
          </Badge>
        )}
      </div>
    </motion.div>
  );
}