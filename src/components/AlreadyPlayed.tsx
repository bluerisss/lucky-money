"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatVND } from "@/lib/lottery";
import BankAccountForm, { type BankAccountInfo } from "@/components/BankAccountForm";
import { saveBankAccount } from "@/lib/playStatus";

interface Props {
  amount: number;
  name: string;
  role: string;
  quizFailed?: boolean;
  bankAccount?: BankAccountInfo | null;
  paymentSent?: boolean;
  onBankAccountUpdated?: () => void;
}

export default function AlreadyPlayed({ amount, name, role, quizFailed = false, bankAccount, paymentSent = false, onBankAccountUpdated }: Props) {
  const [isEditing, setIsEditing] = useState(false);
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

        {/* Bank Account Info */}
        {bankAccount && !isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-card rounded-xl p-4 border border-border mt-3"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-foreground">💳 Thông tin nhận lì xì:</p>
              <div className="flex items-center gap-2">
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
                {!paymentSent && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-primary hover:underline"
                  >
                    ✏️ Sửa
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground text-left">
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

        {/* Bank Account Form (if editing or not saved) */}
        {isEditing && (
          <div className="w-full mt-3">
            <BankAccountForm
              initialData={bankAccount || null}
              isEditing={true}
              onSubmit={async (data) => {
                await saveBankAccount(data);
                setIsEditing(false);
                onBankAccountUpdated?.();
              }}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        )}

        {!bankAccount && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-3 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-crimson hover:scale-105 transition-all"
          >
            💳 Nhập thông tin nhận tiền
          </button>
        )}
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

      {/* Bank Account Info */}
      {bankAccount && !isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-card rounded-xl p-4 border border-border mt-3"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-foreground">💳 Thông tin nhận lì xì:</p>
            <div className="flex items-center gap-2">
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
              {!paymentSent && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-primary hover:underline"
                >
                  ✏️ Sửa
                </button>
              )}
            </div>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground text-left">
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

      {/* Bank Account Form (if editing or not saved) */}
      {isEditing && (
        <div className="w-full mt-3">
          <BankAccountForm
            initialData={bankAccount || null}
            isEditing={!!bankAccount}
            onSubmit={async (data) => {
              await saveBankAccount(data);
              setIsEditing(false);
              onBankAccountUpdated?.();
            }}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}

      {!bankAccount && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="mt-3 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-crimson hover:scale-105 transition-all"
        >
          💳 Nhập thông tin nhận tiền
        </button>
      )}
    </motion.div>
  );
}
