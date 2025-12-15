"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Scan, X, Sparkles, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  usedScans: number;
  maxScans: number;
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onClose,
  usedScans,
  maxScans,
}) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border/50">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Batas Scan Gratis Tercapai
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Kamu sudah menggunakan{" "}
            <span className="font-semibold text-primary">{usedScans}</span> dari{" "}
            <span className="font-semibold text-primary">{maxScans}</span> scan
            gratis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Benefits of logging in */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Keuntungan Login
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Scan className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Scan tanpa batas</span>
              </li>
              <li className="flex items-start gap-2">
                <Scan className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Simpan riwayat identifikasi</span>
              </li>
              <li className="flex items-start gap-2">
                <Scan className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Akses fitur lengkap Felidae Learn</span>
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleLogin}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Masuk ke Akun
            </Button>
            <Button
              onClick={handleRegister}
              variant="outline"
              className="w-full border-primary/50 hover:bg-primary/5"
            >
              Daftar Gratis
            </Button>
          </div>

          {/* Note */}
          <p className="text-xs text-center text-muted-foreground">
            Daftar gratis hanya membutuhkan email dan kata sandi
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPromptModal;
