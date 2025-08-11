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
    <div className="container mx-auto px-4 py-2 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Switch
            id="login-mode"
            checked={isLoggedIn}
            onCheckedChange={onToggleLogin}
            className="data-[state=checked]:bg-emerald-600"
          />
          <Label htmlFor="login-mode" className="text-sm text-emerald-800">
            {isLoggedIn ? "Login Aktif" : "Login Nonaktif"}
          </Label>
        </div>

        {isLoggedIn && (
          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
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
