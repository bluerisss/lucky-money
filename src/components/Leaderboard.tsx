import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatVND, isJackpot } from "@/lib/lottery";
import { getTopEntries, subscribeToLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard";

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load leaderboard ban đầu
    const loadEntries = async () => {
      try {
        const topEntries = await getTopEntries(10); // Top 10
        setEntries(topEntries);
      } catch (error) {
        console.error("Lỗi khi load leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();

    // Subscribe để lắng nghe real-time updates từ Firebase
    const unsubscribe = subscribeToLeaderboard((newEntries) => {
      setEntries(newEntries);
      setLoading(false);
    });

    // Listen for storage changes (fallback cho localStorage)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "luckyMoneyLeaderboard") {
        loadEntries();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Hiển thị loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="w-full max-w-md mx-auto mt-4 px-4"
      >
        <h3 className="text-center text-sm font-black text-crimson mb-3">
          🏆 Phong Thần Bảng
        </h3>
        <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm p-6 text-center">
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </motion.div>
    );
  }

  // Nếu chưa có dữ liệu, hiển thị thông báo
  if (entries.length === 0) {
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
        <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Chưa có dữ liệu. Hãy chơi để xuất hiện trên bảng xếp hạng! 🎮
          </p>
        </div>
      </motion.div>
    );
  }

  const sorted = [...entries].sort((a, b) => {
    // Sort theo amount giảm dần, nếu cùng amount thì sort theo timestamp (mới hơn trước)
    if (b.amount !== a.amount) {
      return b.amount - a.amount;
    }
    return b.timestamp - a.timestamp;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="w-full max-w-md mx-auto mt-4 px-4"
    >
      <h3 className="text-center text-sm font-black text-crimson mb-3">
        🏆 Phong Thần Bảng
      </h3>
      <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
        {sorted.map((entry, i) => (
          <motion.div
            key={`${entry.name}-${entry.timestamp}`}
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
              {entry.name} {entry.role && `(${entry.role})`}
            </span>
            <span className={`text-sm font-black ${isJackpot(entry.amount) ? "text-gold" : "text-crimson"}`}>
              {formatVND(entry.amount)}
            </span>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-2 italic">
        * Bảng xếp hạng chung
      </p>
    </motion.div>
  );
}
