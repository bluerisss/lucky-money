import { motion } from "framer-motion";
import { formatVND } from "@/lib/lottery";

interface Props {
  amount: number;
  role: string;
}

export default function AlreadyPlayed({ amount, role }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-5 px-4 max-w-md mx-auto text-center"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl"
      >
        🎉
      </motion.div>
      <h2 className="text-xl font-black text-crimson">
        Bạn đã nhận lì xì rồi!
      </h2>
      <p className="text-muted-foreground text-sm">
        Bạn ({role}) đã nhận được{" "}
        <span className="font-black text-gold">{formatVND(amount)}</span>
      </p>
      <p className="text-muted-foreground text-sm">
        Hẹn năm sau nhé! 🧧✨
      </p>
    </motion.div>
  );
}
