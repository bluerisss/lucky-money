import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { formatVND, isJackpot } from "@/lib/lottery";

interface Props {
  amount: number;
  onRevealed: () => void;
}

export default function ScratchCard({ amount, onRevealed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scratching, setScratching] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hasCalledReveal = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const WIDTH = 300;
  const HEIGHT = 200;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw scratch overlay
    const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    grad.addColorStop(0, "hsl(45, 90%, 55%)");
    grad.addColorStop(0.5, "hsl(40, 85%, 50%)");
    grad.addColorStop(1, "hsl(45, 90%, 60%)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Text overlay
    ctx.fillStyle = "hsl(0, 80%, 45%)";
    ctx.font = "bold 20px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ Cào tại đây ✨", WIDTH / 2, HEIGHT / 2 + 7);
  }, []);

  const getPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = WIDTH / rect.width;
      const scaleY = HEIGHT / rect.height;
      if ("touches" in e) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY,
        };
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const scratch = useCallback(
    (pos: { x: number; y: number }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.globalCompositeOperation = "destination-out";

      if (lastPos.current) {
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.lineWidth = 40;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      ctx.fill();

      lastPos.current = pos;

      // Check percentage scratched
      const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
      let transparent = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) transparent++;
      }
      const percent = transparent / (WIDTH * HEIGHT);
      if (percent > 0.6 && !hasCalledReveal.current) {
        hasCalledReveal.current = true;
        setRevealed(true);
        onRevealed();
      }
    },
    [onRevealed]
  );

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setScratching(true);
    lastPos.current = getPos(e);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!scratching) return;
    scratch(getPos(e));
  };

  const handleEnd = () => {
    setScratching(false);
    lastPos.current = null;
  };

  const jackpot = isJackpot(amount);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="flex flex-col items-center gap-4"
    >
      <h2 className="text-xl font-black text-crimson">🎫 Cào thẻ trúng thưởng!</h2>

      <div
        className={`relative rounded-2xl overflow-hidden ${
          jackpot && revealed ? "glow-jackpot" : "shadow-crimson"
        }`}
        style={{ width: WIDTH, height: HEIGHT }}
      >
        {/* Prize underneath */}
        <div className="absolute inset-0 gradient-red-gold flex flex-col items-center justify-center">
          <motion.div
            animate={revealed ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gold text-sm font-bold mb-1">🎉 Bạn nhận được</p>
            <p
              className={`font-black text-primary-foreground ${
                jackpot ? "text-3xl" : "text-2xl"
              }`}
            >
              {formatVND(amount)}
            </p>
            {jackpot && (
              <p className="text-gold text-xs mt-1 animate-bounce-gentle">
                🏆 JACKPOT! 🏆
              </p>
            )}
          </motion.div>
        </div>

        {/* Scratch canvas */}
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="absolute inset-0 cursor-crosshair touch-none"
          style={{ width: "100%", height: "100%" }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>

      <p className="text-xs text-muted-foreground animate-pulse">
        {revealed ? "🎊 Chúc mừng bạn!" : "👆 Dùng ngón tay hoặc chuột để cào"}
      </p>
    </motion.div>
  );
}
