"use client"

interface SectionBackgroundProps {
  variant?: "dots" | "grid" | "gradient" | "mesh" | "waves"
  className?: string
}

export function SectionBackground({ variant = "dots", className = "" }: SectionBackgroundProps) {
  const backgrounds = {
    dots: (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/8 rounded-full blur-[100px] opacity-40" />
      </div>
    ),
    grid: (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/12 rounded-full blur-[100px] opacity-60" />
      </div>
    ),
    gradient: (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent/8 rounded-full blur-[100px]" />
      </div>
    ),
    mesh: (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-accent/5 rounded-full blur-[60px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 50%, currentColor 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>
    ),
    waves: (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none">
          <path d="M0,50 Q250,0 500,50 T1000,50 T1500,50 T2000,50" fill="none" stroke="currentColor" strokeWidth="1" />
          <path
            d="M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-64 bg-primary/8 rounded-full blur-[100px]" />
      </div>
    ),
  }

  return backgrounds[variant]
}
