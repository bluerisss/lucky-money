import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onStart: (name: string, role: string) => void;
}

const ROLES = ["Developer", "HR", "DevOps", "Designer", "PM", "Tester", "BA", "Sales", "BOD"];

export default function LandingScreen({ onStart }: Props) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6 px-4 py-8 w-full max-w-md mx-auto"
    >
      {/* Envelope */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="w-48 h-56 rounded-2xl gradient-envelope shadow-crimson relative overflow-hidden flex items-center justify-center">
          {/* Envelope flap */}
          <div
            className="absolute top-0 left-0 right-0 h-20"
            style={{
              background: "linear-gradient(180deg, hsl(0 85% 42%) 0%, hsl(0 80% 48%) 100%)",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />
          {/* Gold seal */}
          <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center z-10 shadow-gold">
            <span className="text-3xl">🧧</span>
          </div>
          {/* Gold border decoration */}
          <div className="absolute inset-2 rounded-xl border-2 border-gold opacity-30" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl md:text-3xl font-black text-crimson text-center"
      >
        🧧 Lì Xì May Mắn 🧧
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-muted-foreground text-center text-sm"
      >
        Cào thẻ nhận lì xì đầu năm!
      </motion.p>

      {/* Name input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full"
      >
        <label className="block text-sm font-semibold text-foreground mb-2 text-center">
          Tên của bạn
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên của bạn..."
          className="w-full px-4 py-3 rounded-xl bg-card border-2 border-border focus:border-primary focus:outline-none text-center font-semibold text-foreground placeholder:text-muted-foreground transition-colors"
        />
      </motion.div>

      {/* Role quick picks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full"
      >
        <label className="block text-sm font-semibold text-foreground mb-2 text-center">
          Vai trò của bạn
        </label>
        <div className="flex flex-wrap gap-2 justify-center mb-3">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                role === r
                  ? "bg-primary text-primary-foreground scale-105 shadow-crimson"
                  : "bg-card text-foreground border border-border hover:border-primary/50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Hoặc nhập vai trò khác..."
          className="w-full px-4 py-3 rounded-xl bg-card border-2 border-border focus:border-primary focus:outline-none text-center font-semibold text-foreground placeholder:text-muted-foreground transition-colors"
        />
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!name.trim() || !role.trim()}
        onClick={() => onStart(name.trim(), role.trim())}
        className="w-full py-4 rounded-xl font-black text-lg gradient-red-gold text-primary-foreground shadow-crimson disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Nhận lì xì 🧧
      </motion.button>
    </motion.div>
  );
}
