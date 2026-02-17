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
import { addToLeaderboard } from "@/lib/leaderboard";
import { getPlayStatus, savePlayStatus, hasPlayedSync, type PlayStatus } from "@/lib/playStatus";

type Screen = "landing" | "scratch" | "result" | "already";

export default function Index() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [amount, setAmount] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [playStatus, setPlayStatus] = useState<PlayStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { play } = useSound();

  // Load play status khi component mount
  useEffect(() => {
    const loadPlayStatus = async () => {
      try {
        // Check sync trước để hiển thị nhanh
        if (hasPlayedSync()) {
          const status = await getPlayStatus();
          if (status?.hasPlayed) {
            setPlayStatus(status);
            setScreen("already");
            setName(status.name);
            setRole(status.role);
            setAmount(status.amountWon);
          }
        }
      } catch (error) {
        console.error("Lỗi khi load play status:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayStatus();
  }, []);

  const handleStart = useCallback(
    async (inputName: string, inputRole: string) => {
      // Re-check play status
      const status = await getPlayStatus();
      if (status?.hasPlayed) {
        setPlayStatus(status);
        setScreen("already");
        setName(status.name);
        setRole(status.role);
        setAmount(status.amountWon);
        return;
      }
      const amt = getRandomAmount();
      setName(inputName);
      setRole(inputRole);
      setAmount(amt);
      setScreen("scratch");
      play("drumroll");
    },
    [play]
  );

  const handleRevealed = useCallback(async () => {
    // Lưu trạng thái đã chơi vào Firebase (hoặc localStorage nếu Firebase chưa config)
    await savePlayStatus(amount, name, role);
    
    // Cập nhật state
    const status: PlayStatus = {
      hasPlayed: true,
      amountWon: amount,
      name,
      role,
      timestamp: Date.now(),
    };
    setPlayStatus(status);

    // Lưu vào leaderboard (async - không cần await vì không cần chờ)
    addToLeaderboard(name, role, amount).catch((error) => {
      console.error("Lỗi khi lưu leaderboard:", error);
    });

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

  // Hiển thị loading khi đang check play status
  if (loading) {
    return (
      <div className="min-h-screen bg-background relative flex flex-col items-center justify-center overflow-hidden py-8">
        <FloatingLanterns />
        <div className="relative z-10 w-full flex items-center justify-center">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

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
              <ResultScreen amount={amount} greeting={greeting} name={name} role={role} />
              <Leaderboard />
            </div>
          )}
          {screen === "already" && (
            <div key="already">
              <AlreadyPlayed amount={playStatus?.amountWon || amount} name={playStatus?.name || name} role={playStatus?.role || role} />
              <Leaderboard />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
