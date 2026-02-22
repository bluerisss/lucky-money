"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type AccountType = "momo" | "bank";

export interface BankAccountInfo {
  type: AccountType;
  accountNumber: string;
  accountName: string;
  bankName?: string; // Chỉ có khi type === "bank"
}

interface Props {
  initialData?: BankAccountInfo | null;
  onSubmit: (data: BankAccountInfo) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

export default function BankAccountForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: Props) {
  const [type, setType] = useState<AccountType>(initialData?.type || "momo");
  const [accountNumber, setAccountNumber] = useState(initialData?.accountNumber || "");
  const [accountName, setAccountName] = useState(initialData?.accountName || "");
  const [bankName, setBankName] = useState(initialData?.bankName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!accountNumber.trim()) {
      setError(`Vui lòng nhập ${type === "momo" ? "số điện thoại" : "số tài khoản"}`);
      return;
    }

    if (!accountName.trim()) {
      setError("Vui lòng nhập tên chủ tài khoản");
      return;
    }

    if (type === "bank" && !bankName.trim()) {
      setError("Vui lòng nhập tên ngân hàng");
      return;
    }

    // Validate phone number format for Momo
    if (type === "momo") {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(accountNumber.replace(/\s/g, ""))) {
        setError("Số điện thoại không hợp lệ (10-11 số)");
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit({
        type,
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
        bankName: type === "bank" ? bankName.trim() : null,
      });
    } catch (err) {
      setError("Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.");
      console.error("Error saving bank account:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto px-4"
    >
      <div className="bg-card rounded-2xl p-6 border-2 border-border shadow-crimson">
        <h3 className="text-lg font-black text-crimson mb-4 text-center">
          {isEditing ? "✏️ Cập nhật thông tin nhận lì xì" : "💳 Nhập thông tin nhận lì xì"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Loại tài khoản
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setType("momo");
                  setBankName("");
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                  type === "momo"
                    ? "bg-primary text-primary-foreground shadow-crimson"
                    : "bg-card border-2 border-border text-foreground hover:border-primary/50"
                }`}
              >
                💰 Momo
              </button>
              <button
                type="button"
                onClick={() => {
                  setType("bank");
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                  type === "bank"
                    ? "bg-primary text-primary-foreground shadow-crimson"
                    : "bg-card border-2 border-border text-foreground hover:border-primary/50"
                }`}
              >
                🏦 Ngân hàng
              </button>
            </div>
          </div>

          {/* Account Number / Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              {type === "momo" ? "Số điện thoại Momo" : "Số tài khoản"}
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder={type === "momo" ? "0123456789" : "1234567890"}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-semibold text-foreground"
              maxLength={type === "momo" ? 11 : 20}
            />
          </div>

          {/* Account Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Tên chủ tài khoản
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-semibold text-foreground"
            />
          </div>

          {/* Bank Name (only for bank type) */}
          {type === "bank" && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Tên ngân hàng
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Vietcombank, Techcombank, BIDV..."
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-semibold text-foreground"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-card border-2 border-border text-foreground hover:border-primary/50 transition-all"
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl font-black gradient-red-gold text-primary-foreground shadow-crimson disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Đang lưu..." : isEditing ? "Cập nhật" : "Lưu thông tin"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
