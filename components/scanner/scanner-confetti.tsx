import React from "react"
import { motion } from "framer-motion"

interface ScannerConfettiProps {
  isVisible: boolean
}

export const ScannerConfetti: React.FC<ScannerConfettiProps> = ({ isVisible }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`confetti-${i}`}
            initial={{
              top: "-10%",
              left: `${Math.random() * 100}%`,
              rotate: 0,
              scale: 0,
            }}
            animate={{
              top: "110%",
              rotate: 360,
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              ease: "easeOut",
              delay: Math.random() * 0.5,
            }}
            className={`absolute w-3 h-3 rounded-full bg-${["emerald", "green", "teal", "yellow"][Math.floor(Math.random() * 4)]
              }-${Math.floor(Math.random() * 3 + 3) * 100}`}
          />
        ))}
      </div>
    </div>
  )
}
