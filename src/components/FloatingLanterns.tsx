import { useEffect, useState } from "react";

interface Lantern {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export default function FloatingLanterns() {
  const [lanterns] = useState<Lantern[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 16 + Math.random() * 24,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 10,
      opacity: 0.15 + Math.random() * 0.2,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {lanterns.map((l) => (
        <div
          key={l.id}
          className="absolute animate-float"
          style={{
            left: `${l.x}%`,
            bottom: `-${l.size}px`,
            width: l.size,
            height: l.size * 1.4,
            opacity: l.opacity,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
          }}
        >
          {/* Lantern SVG */}
          <svg viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="0" width="12" height="6" rx="1" fill="hsl(45, 90%, 55%)" />
            <ellipse cx="20" cy="28" rx="18" ry="22" fill="hsl(0, 80%, 50%)" />
            <ellipse cx="20" cy="28" rx="18" ry="22" fill="url(#lanternGrad)" />
            <rect x="16" y="50" width="8" height="4" rx="1" fill="hsl(45, 90%, 55%)" />
            <line x1="20" y1="54" x2="20" y2="56" stroke="hsl(45, 80%, 55%)" strokeWidth="1.5" />
            <defs>
              <radialGradient id="lanternGrad" cx="0.5" cy="0.3" r="0.6">
                <stop offset="0%" stopColor="hsl(0, 80%, 65%)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(0, 80%, 40%)" stopOpacity="0.3" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}
