import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import FloatingLanterns from "@/components/FloatingLanterns";
import LandingScreen from "@/components/LandingScreen";
import ScratchCard from "@/components/ScratchCard";
import ResultScreen from "@/components/ResultScreen";
import AlreadyPlayed from "@/components/AlreadyPlayed";
import Leaderboard from "@/components/Leaderboard";
import { useSound } from "@/hooks/useSound";
import { getRandomAmount, isJackpot } from "@/lib/lottery";
import { getGreeting } from "@/lib/greetings";

type Screen = "landing" | "scratch" | "result" | "already";

const LS_KEY = "luckyMoney";

function getSaved() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { hasPlayed: boolean; amountWon: number; role: string };
  } catch {
    return null;
  }
}

export default function Index() {
  const saved = getSaved();
  const [screen, setScreen] = useState<Screen>(saved?.hasPlayed ? "already" : "landing");
  const [role, setRole] = useState(saved?.role || "");
  const [amount, setAmount] = useState(saved?.amountWon || 0);
  const [greeting, setGreeting] = useState("");
  const { play } = useSound();

  const handleStart = useCallback(
    (inputRole: string) => {
      // Re-check localStorage
      if (getSaved()?.hasPlayed) {
        setScreen("already");
        return;
      }
      const amt = getRandomAmount();
      setRole(inputRole);
      setAmount(amt);
      setScreen("scratch");
      play("drumroll");
    },
    [play]
  );

  const handleRevealed = useCallback(() => {
    // Save to localStorage
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ hasPlayed: true, amountWon: amount, role })
    );

    // Generate greeting
    setGreeting(getGreeting(role));

    // Play sounds
    play("coin");
    setTimeout(() => play("celebration"), 300);

    // Confetti
    const jackpot = isJackpot(amount);
    const duration = jackpot ? 4000 : 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: jackpot ? 8 : 3,
        angle: 60 + Math.random() * 60,
        spread: jackpot ? 80 : 55,
        origin: { x: Math.random(), y: Math.random() * 0.6 },
        colors: ["#e53e3e", "#d69e2e", "#f6e05e", "#fff5f5", "#fc8181"],
        gravity: jackpot ? 0.6 : 1,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    // Transition to result
    setTimeout(() => setScreen("result"), jackpot ? 2500 : 1500);
  }, [amount, role, play]);

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center overflow-hidden py-8">
      <FloatingLanterns />

      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {screen === "landing" && (
            <LandingScreen key="landing" onStart={handleStart} />
          )}
          {screen === "scratch" && (
            <div key="scratch" className="flex flex-col items-center">
              <ScratchCard amount={amount} onRevealed={handleRevealed} />
            </div>
          )}
          {screen === "result" && (
            <div key="result">
              <ResultScreen amount={amount} greeting={greeting} role={role} />
              <Leaderboard />
            </div>
          )}
          {screen === "already" && (
            <div key="already">
              <AlreadyPlayed amount={saved?.amountWon || amount} role={saved?.role || role} />
              <Leaderboard />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
