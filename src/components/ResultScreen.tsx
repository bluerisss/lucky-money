import { motion } from "framer-motion";
import { formatVND, isJackpot } from "@/lib/lottery";

interface Props {
  amount: number;
  greeting: string;
  name: string;
  role: string;
}

export default function ResultScreen({ amount, greeting, name, role }: Props) {
  const jackpot = isJackpot(amount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-5 px-4 w-full max-w-md mx-auto"
    >
      {/* Mascot */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-7xl"
      >
        {jackpot ? "🐉" : "🐱"}
      </motion.div>

      {/* Amount */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className={`w-full py-6 rounded-2xl text-center ${
          jackpot
            ? "gradient-red-gold glow-jackpot"
            : "gradient-envelope shadow-crimson"
        }`}
      >
        <p className="text-primary-foreground/80 text-sm font-bold mb-1">
          🧧 Lì xì của bạn
        </p>
        <p className={`font-black text-primary-foreground ${jackpot ? "text-4xl" : "text-3xl"}`}>
          {formatVND(amount)}
        </p>
        {jackpot && (
          <motion.p
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-gold text-sm font-black mt-2"
          >
            🏆 JACKPOT! 🏆
          </motion.p>
        )}
      </motion.div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full bg-card rounded-2xl p-5 border-2 border-gold/30 shadow-gold/10"
      >
        <p className="text-xs text-muted-foreground mb-2 font-bold">
          🤖 Lời chúc dành cho {name} ({role}):
        </p>
        <p className="text-foreground font-semibold text-base leading-relaxed">
          {greeting}
        </p>
      </motion.div>

      {/* Share button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const text = `🧧 ${name} vừa nhận được ${formatVND(amount)} lì xì!\n${greeting}\n\nVào nhận lì xì ngay!`;
          if (navigator.share) {
            navigator.share({ title: "Lì Xì May Mắn", text });
          } else {
            navigator.clipboard.writeText(text);
            alert("Đã copy vào clipboard! 📋");
          }
        }}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-crimson"
      >
        Chia sẻ niềm vui 🎉
      </motion.button>
    </motion.div>
  );
}
