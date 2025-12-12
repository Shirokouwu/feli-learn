"use client";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { History } from "lucide-react"

interface ScannerHeaderProps {
  isLoggedIn: boolean
  onToggleLogin: (checked: boolean) => void
  onShowHistory: () => void
}

export const ScannerHeader: React.FC<ScannerHeaderProps> = ({
  isLoggedIn,
  onToggleLogin,
  onShowHistory
}) => {
  return (
    <div className="container mx-auto px-4 py-2 mb-4 mt-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Switch
            id="login-mode"
            checked={isLoggedIn}
            onCheckedChange={onToggleLogin}
            className="data-[state=checked]:bg-primary"
          />
          <Label htmlFor="login-mode" className="text-sm text-foreground">
            {isLoggedIn ? "Login Aktif" : "Login Nonaktif"}
          </Label>
        </div>

        {isLoggedIn && (
          <Button
            variant="ghost"
            size="sm"
            className="text-foreground hover:text-primary hover:bg-primary/10"
            onClick={onShowHistory}
          >
            <History className="h-4 w-4 mr-2" />
            Riwayat Scan
          </Button>
        )}
      </div>
    </div>
  )
}
