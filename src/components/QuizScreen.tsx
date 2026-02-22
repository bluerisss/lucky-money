"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question, checkAnswer } from "@/lib/questions";

interface Props {
  question: Question;
  attemptsLeft: number;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuizScreen({ question, attemptsLeft, onAnswer }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (index: number) => {
    if (showResult) return; // Không cho chọn lại khi đã hiển thị kết quả
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = checkAnswer(question, selectedAnswer);
    setIsCorrect(correct);
    setShowResult(true);

    // Delay một chút để user thấy kết quả
    setTimeout(() => {
      onAnswer(correct);
      // Reset state
      setSelectedAnswer(null);
      setShowResult(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6 px-4 py-8 w-full max-w-md mx-auto"
    >
      {/* Header */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-black text-crimson mb-2"
        >
          🧠 Không dễ ăn vậy đâu tình iu, trả lời câu đố trước nhé 🧠
        </motion.h2>
        <p className="text-muted-foreground text-sm">
          Trả lời đúng để được cào lì xì!
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">
            Số lượt còn lại:
          </span>
          <span className="text-lg font-black text-crimson">
            {attemptsLeft}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full bg-card rounded-2xl p-6 border-2 border-border shadow-crimson"
      >
        <h3 className="text-lg font-bold text-foreground mb-6 text-center">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === question.correctAnswer;
            let bgClass = "bg-card border-2 border-border hover:border-primary/50";
            
            if (showResult) {
              if (isCorrectOption) {
                bgClass = "bg-green-500/20 border-2 border-green-500";
              } else if (isSelected && !isCorrect) {
                bgClass = "bg-red-500/20 border-2 border-red-500";
              }
            } else if (isSelected) {
              bgClass = "bg-primary/10 border-2 border-primary";
            }

            return (
              <motion.button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showResult}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
                className={`w-full px-4 py-3 rounded-xl text-left font-semibold transition-all ${bgClass} ${
                  showResult ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-muted-foreground w-6">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="flex-1 text-foreground">{option}</span>
                  {showResult && isCorrectOption && (
                    <span className="text-green-500 text-xl">✓</span>
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <span className="text-red-500 text-xl">✗</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showResult && question.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-muted rounded-lg"
            >
              <p className="text-sm text-muted-foreground">
                <span className="font-bold">💡 Giải thích:</span> {question.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Result Message */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`text-center p-4 rounded-xl ${
              isCorrect ? "bg-green-500/20 text-green-700" : "bg-red-500/20 text-red-700"
            }`}
          >
            <p className="text-lg font-black">
              {isCorrect ? "🎉 Chúc mừng! Đáp án đúng!" : "❌ Sai rồi! Thử lại nhé!"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      {!showResult && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={selectedAnswer === null}
          onClick={handleSubmit}
          className="w-full py-4 rounded-xl font-black text-lg gradient-red-gold text-primary-foreground shadow-crimson disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Xác nhận đáp án ✨
        </motion.button>
      )}
    </motion.div>
  );
}
