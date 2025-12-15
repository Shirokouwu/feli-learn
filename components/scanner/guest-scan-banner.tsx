"use client";

import { LogIn, Scan, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuestScanBannerProps {
  remainingScans: number;
  maxScans: number;
  hasReachedLimit: boolean;
  onLoginClick: () => void;
  className?: string;
}

export const GuestScanBanner: React.FC<GuestScanBannerProps> = ({
  remainingScans,
  maxScans,
  hasReachedLimit,
  onLoginClick,
  className,
}) => {
  if (hasReachedLimit) {
    return (
      <div
        className={cn(
          "mb-4 p-4 bg-destructive/10 border border-destructive/30 rounded-2xl",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-destructive/20 rounded-full">
              <Scan className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <h4 className="font-medium text-destructive">
                Batas Scan Gratis Tercapai
              </h4>
              <p className="text-sm text-muted-foreground">
                Login untuk melanjutkan menggunakan scanner tanpa batas.
              </p>
            </div>
          </div>
          <Button
            onClick={onLoginClick}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login Sekarang
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mb-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Info className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">
              Mode Tamu -{" "}
              <span className="text-primary">
                {remainingScans} dari {maxScans}
              </span>{" "}
              scan gratis tersisa
            </h4>
            <p className="text-sm text-muted-foreground">
              Login untuk akses penuh dan simpan riwayat scan.
            </p>
          </div>
        </div>
        <Button
          onClick={onLoginClick}
          variant="outline"
          size="sm"
          className="border-primary/50 hover:bg-primary/5 whitespace-nowrap"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
      </div>
    </div>
  );
};

export default GuestScanBanner;
