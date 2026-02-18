// Câu đố để user phải trả lời trước khi cào lì xì

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number; // Index của đáp án đúng (0-based)
  explanation?: string; // Giải thích đáp án (optional)
}

export const QUESTIONS: Question[] = [
  {
    question: "Năm mới theo lịch âm là năm con gì?",
    options: ["Rồng", "Rắn", "Ngựa", "Dê"],
    correctAnswer: 0,
    explanation: "Năm 2024 là năm Giáp Thìn (năm Rồng)",
  },
  {
    question: "Màu đỏ và vàng là màu truyền thống của Tết vì sao?",
    options: [
      "Tượng trưng cho may mắn và thịnh vượng",
      "Màu yêu thích của người Việt",
      "Dễ nhìn nhất",
      "Không có lý do đặc biệt",
    ],
    correctAnswer: 0,
    explanation: "Màu đỏ tượng trưng cho may mắn, vàng tượng trưng cho thịnh vượng",
  },
  {
    question: "Lì xì thường được đựng trong gì?",
    options: ["Bao lì xì màu đỏ", "Túi nilon", "Hộp giấy", "Tất cả đều đúng"],
    correctAnswer: 0,
    explanation: "Bao lì xì màu đỏ là truyền thống nhất",
  },
  {
    question: "Người lớn thường lì xì cho trẻ em vào dịp nào?",
    options: ["Đêm Giao thừa", "Sáng mùng 1", "Cả tuần đầu năm", "Tất cả đều đúng"],
    correctAnswer: 3,
    explanation: "Lì xì có thể được trao trong cả tuần đầu năm mới",
  },
  {
    question: "Số tiền lì xì thường là số như thế nào?",
    options: [
      "Số chẵn",
      "Số lẻ",
      "Số có đuôi 8 hoặc 9",
      "Không quan trọng",
    ],
    correctAnswer: 2,
    explanation: "Số 8 tượng trưng phát tài, số 9 tượng trưng trường cửu",
  },
  {
    question: "Mâm ngũ quả ngày Tết thường có mấy loại quả?",
    options: ["3 loại", "5 loại", "7 loại", "Tùy gia đình"],
    correctAnswer: 1,
    explanation: "Mâm ngũ quả có 5 loại quả tượng trưng cho ngũ phúc",
  },
  {
    question: "Bánh chưng thường được gói bằng lá gì?",
    options: ["Lá chuối", "Lá dong", "Lá tre", "Lá sen"],
    correctAnswer: 1,
    explanation: "Lá dong là lá truyền thống để gói bánh chưng",
  },
  {
    question: "Tết Nguyên Đán kéo dài bao nhiêu ngày?",
    options: ["3 ngày", "7 ngày", "15 ngày", "1 tháng"],
    correctAnswer: 1,
    explanation: "Tết thường kéo dài 7 ngày (từ mùng 1 đến mùng 7)",
  },
  {
    question: "Cây nào thường được trang trí trong nhà vào dịp Tết?",
    options: ["Cây đào", "Cây mai", "Cả hai", "Không có"],
    correctAnswer: 2,
    explanation: "Miền Bắc dùng đào, miền Nam dùng mai",
  },
  {
    question: "Món ăn nào KHÔNG phải là món truyền thống ngày Tết?",
    options: ["Bánh chưng", "Thịt kho tàu", "Pizza", "Dưa hành"],
    correctAnswer: 2,
    explanation: "Pizza không phải món truyền thống Tết Việt Nam",
  },
  {
    question: "Lời chúc 'Tấn Tài Tấn Lộc' có nghĩa là gì?",
    options: [
      "Tiền vào như nước",
      "Phát tài phát lộc",
      "May mắn cả năm",
      "Tất cả đều đúng",
    ],
    correctAnswer: 1,
    explanation: "Tấn Tài Tấn Lộc nghĩa là phát tài phát lộc",
  },
  {
    question: "Ngày mùng 1 Tết thường làm gì đầu tiên?",
    options: [
      "Đi chùa cầu may",
      "Chúc Tết ông bà",
      "Xông đất",
      "Tất cả đều đúng",
    ],
    correctAnswer: 3,
    explanation: "Tất cả đều là hoạt động quan trọng ngày mùng 1",
  },
  {
    question: "Số lượng bao lì xì nhận được có ý nghĩa gì?",
    options: [
      "Càng nhiều càng may mắn",
      "Không quan trọng",
      "Phải là số lẻ",
      "Phải là số chẵn",
    ],
    correctAnswer: 0,
    explanation: "Nhận được nhiều bao lì xì nghĩa là được nhiều người chúc phúc",
  },
  {
    question: "Màu nào KHÔNG nên mặc vào ngày Tết theo quan niệm dân gian?",
    options: ["Đỏ", "Vàng", "Trắng", "Xanh"],
    correctAnswer: 2,
    explanation: "Màu trắng tượng trưng cho tang tóc, nên tránh ngày Tết",
  },
  {
    question: "Tết Nguyên Đán bắt đầu từ ngày nào?",
    options: [
      "30 tháng Chạp",
      "Mùng 1 tháng Giêng",
      "Đêm Giao thừa",
      "Tất cả đều đúng",
    ],
    correctAnswer: 1,
    explanation: "Tết chính thức bắt đầu từ mùng 1 tháng Giêng",
  },
];

/**
 * Lấy một câu hỏi ngẫu nhiên
 */
export function getRandomQuestion(): Question {
  const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
  return QUESTIONS[randomIndex];
}

/**
 * Kiểm tra đáp án có đúng không
 */
export function checkAnswer(question: Question, selectedAnswer: number): boolean {
  return question.correctAnswer === selectedAnswer;
}
