"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import FloatingLanterns from "@/components/FloatingLanterns";
import LandingScreen from "@/components/LandingScreen";
import QuizScreen from "@/components/QuizScreen";
import ScratchCard from "@/components/ScratchCard";
import ResultScreen from "@/components/ResultScreen";
import AlreadyPlayed from "@/components/AlreadyPlayed";
import Leaderboard from "@/components/Leaderboard";
import { useSound } from "@/hooks/useSound";
import { getRandomAmount, isJackpot } from "@/lib/lottery";
import { getGreeting } from "@/lib/greetings";
import { addToLeaderboard } from "@/lib/leaderboard";
import { getPlayStatus, savePlayStatus, hasPlayedSync, type PlayStatus } from "@/lib/playStatus";
import { getRandomQuestion, type Question } from "@/lib/questions";

type Screen = "landing" | "quiz" | "scratch" | "result" | "already";

export default function IndexClient() {
  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState<Screen>("landing");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [amount, setAmount] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [playStatus, setPlayStatus] = useState<PlayStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [quizAttempts, setQuizAttempts] = useState(5);
  const [quizFailedFlag, setQuizFailedFlag] = useState(false);
  const { play } = useSound();

  // Đảm bảo component chỉ render sau khi mount (tránh hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load play status khi component mount (chỉ trên client)
  useEffect(() => {
    if (!mounted) return;

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
            // Nếu quizFailed, không cần set amount vì đã là 0
          }
        }
      } catch (error) {
        console.error("Lỗi khi load play status:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayStatus();
  }, [mounted]);

  const handleStart = useCallback(async (inputName: string, inputRole: string) => {
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
    setName(inputName);
    setRole(inputRole);
    // Reset quiz attempts, trạng thái quizFailed và chọn câu hỏi mới
    setQuizAttempts(5);
    setQuizFailedFlag(false);
    setCurrentQuestion(getRandomQuestion(inputRole));
    setScreen("quiz");
  }, []);

  const handleQuizAnswer = useCallback(
    async (isCorrect: boolean) => {
      if (isCorrect) {
        // Trả lời đúng -> chuyển sang màn hình scratch
        setQuizFailedFlag(false);
        const amt = getRandomAmount();
        setAmount(amt);
        setScreen("scratch");
        play("drumroll");
      } else {
        // Trả lời sai -> giảm số lượt
        const newAttempts = quizAttempts - 1;
        setQuizAttempts(newAttempts);

        if (newAttempts <= 0) {
          // Hết lượt nhưng vẫn cho cào lì xì, đánh dấu quizFailed
          setQuizFailedFlag(true);
          const amt = getRandomAmount();
          setAmount(amt);
          setScreen("scratch");
          play("drumroll");
        } else {
          // Còn lượt -> chọn câu hỏi mới
          setCurrentQuestion(getRandomQuestion(role));
        }
      }
    },
    [quizAttempts, play, role]
  );

  const handleRevealed = useCallback(
    async () => {
      // Lưu trạng thái đã chơi vào Firebase (hoặc localStorage nếu Firebase chưa config)
      await savePlayStatus(amount, name, role, quizFailedFlag);

      // Cập nhật state
      const status: PlayStatus = {
        hasPlayed: true,
        amountWon: amount,
        name,
        role,
        timestamp: Date.now(),
        quizFailed: quizFailedFlag,
      };
      setPlayStatus(status);

      // Lưu vào leaderboard (async - không cần await vì không cần chờ)
      addToLeaderboard(name, role, amount, quizFailedFlag).catch((error) => {
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
    },
    [amount, name, role, play, quizFailedFlag]
  );

  const handleBankAccountSaved = useCallback(async () => {
    // Reload play status để lấy thông tin bankAccount mới
    const status = await getPlayStatus();
    if (status) {
      setPlayStatus(status);
    }
  }, []);

  // Hiển thị loading khi chưa mount hoặc đang check play status
  // Đảm bảo server và client render giống nhau
  if (!mounted || loading) {
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
          {screen === "landing" && <LandingScreen key="landing" onStart={handleStart} />}
          {screen === "quiz" && currentQuestion && (
            <QuizScreen key="quiz" question={currentQuestion} attemptsLeft={quizAttempts} onAnswer={handleQuizAnswer} />
          )}
          {screen === "scratch" && (
            <div key="scratch" className="flex flex-col items-center">
              <ScratchCard amount={amount} onRevealed={handleRevealed} quizFailed={quizFailedFlag} />
            </div>
          )}
          {screen === "result" && (
            <div key="result">
              <ResultScreen
                amount={amount}
                greeting={greeting}
                name={name}
                role={role}
                bankAccount={playStatus?.bankAccount}
                paymentSent={playStatus?.paymentSent || false}
                onBankAccountSaved={handleBankAccountSaved}
              />
              <Leaderboard />
            </div>
          )}
          {screen === "already" && (
            <div key="already">
              <AlreadyPlayed
                amount={playStatus?.amountWon || amount}
                name={playStatus?.name || name}
                role={playStatus?.role || role}
                quizFailed={playStatus?.quizFailed || false}
                bankAccount={playStatus?.bankAccount}
                paymentSent={playStatus?.paymentSent || false}
                onBankAccountUpdated={handleBankAccountSaved}
              />
              <Leaderboard />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

