import { motion } from "framer-motion";
import { formatVND } from "@/lib/lottery";

const MOCK_DATA = [
  { name: "Minh (Dev)", amount: 500000, emoji: "🧑‍💻" },
  { name: "Lan (HR)", amount: 300000, emoji: "👩‍💼" },
  { name: "Tuấn (DevOps)", amount: 200000, emoji: "🔧" },
  { name: "Hương (Designer)", amount: 100000, emoji: "🎨" },
  { name: "Đức (PM)", amount: 50000, emoji: "📋" },
  { name: "Linh (Tester)", amount: 888000, emoji: "🐛" },
];

export default function Leaderboard() {
  const sorted = [...MOCK_DATA].sort((a, b) => b.amount - a.amount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="w-full max-w-md mx-auto mt-4 px-4"
    >
      <h3 className="text-center text-sm font-black text-crimson mb-3">
        🏆 Bảng Xếp Hạng May Mắn
      </h3>
      <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
        {sorted.map((entry, i) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 + i * 0.1 }}
            className={`flex items-center px-4 py-3 ${
              i !== sorted.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="text-sm font-black text-muted-foreground w-6">
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
            </span>
            <span className="text-lg mr-2">{entry.emoji}</span>
            <span className="flex-1 text-sm font-semibold text-foreground">
              {entry.name}
            </span>
            <span className={`text-sm font-black ${entry.amount >= 300000 ? "text-gold" : "text-crimson"}`}>
              {formatVND(entry.amount)}
            </span>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-2 italic">
        * Bảng xếp hạng minh hoạ
      </p>
    </motion.div>
  );
}
