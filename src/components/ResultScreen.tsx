"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatVND, isJackpot } from "@/lib/lottery";
import BankAccountForm, { type BankAccountInfo } from "@/components/BankAccountForm";
import { saveBankAccount } from "@/lib/playStatus";

interface Props {
  amount: number;
  greeting: string;
  name: string;
  role: string;
  bankAccount?: BankAccountInfo | null;
  paymentSent?: boolean;
  onBankAccountSaved?: () => void;
}

export default function ResultScreen({ amount, greeting, name, role, bankAccount, paymentSent = false, onBankAccountSaved }: Props) {
  const [showForm, setShowForm] = useState(!bankAccount);
  const [saved, setSaved] = useState(!!bankAccount);
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

      {/* Bank Account Form */}
      {showForm && !saved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full"
        >
          <BankAccountForm
            onSubmit={async (data) => {
              await saveBankAccount(data);
              setSaved(true);
              setShowForm(false);
              onBankAccountSaved?.();
            }}
          />
        </motion.div>
      )}

      {/* Bank Account Info (if saved) */}
      {saved && bankAccount && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full bg-card rounded-2xl p-5 border-2 border-border"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-foreground">💳 Thông tin nhận lì xì:</p>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
              paymentSent 
                ? "bg-green-500/20 text-green-600 border border-green-500/30" 
                : "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30"
            }`}>
              {paymentSent ? (
                <>
                  ✅ <span>Xiền tới rồi</span>
                </>
              ) : (
                <>
                  ⏳ <span>Xiền đang tới</span>
                </>
              )}
            </div>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold">Loại:</span> {bankAccount.type === "momo" ? "💰 Momo" : "🏦 Ngân hàng"}
            </p>
            <p>
              <span className="font-semibold">{bankAccount.type === "momo" ? "SĐT:" : "Số TK:"}</span> {bankAccount.accountNumber}
            </p>
            <p>
              <span className="font-semibold">Tên:</span> {bankAccount.accountName}
            </p>
            {bankAccount.bankName && (
              <p>
                <span className="font-semibold">Ngân hàng:</span> {bankAccount.bankName}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Share button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: saved ? 1.2 : 0.9 }}
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
