import { motion } from "framer-motion";
import { formatVND } from "@/lib/lottery";

interface Props {
  amount: number;
  name: string;
  role: string;
  quizFailed?: boolean;
}

export default function AlreadyPlayed({ amount, name, role, quizFailed = false }: Props) {
  if (quizFailed) {
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
          Nhận lì xì rồi còn đòi nhận nữa à? Tham lam!
        </h2>
        <p className="text-muted-foreground text-sm">
          {name} ({role}) đã nhận được{" "}
          <span className="font-black text-gold">{formatVND(amount)}</span>
        </p>
        <p className="text-muted-foreground text-sm">
          Đợt trước trả lời sai mà vẫn được lì xì đó nha, đừng đòi thêm 😏
        </p>
      </motion.div>
    );
  }

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
        Nhận lì xì rồi còn đòi nhận nữa à? Tham lam!
      </h2>
      <p className="text-muted-foreground text-sm">
        {name} ({role}) đã nhận được{" "}
        <span className="font-black text-gold">{formatVND(amount)}</span>
      </p>
      <p className="text-muted-foreground text-sm">
        Hẹn năm sau nhé! 🧧✨
      </p>
    </motion.div>
  );
}
