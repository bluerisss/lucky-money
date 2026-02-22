// Câu đố để user phải trả lời trước khi cào lì xì

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number; // Index của đáp án đúng (0-based)
  explanation?: string; // Giải thích đáp án (optional)
}

export const QUESTIONS: Question[] = [
  {
    question: "Đầu năm mới, điều gì quan trọng nhất?",
    options: [
      "Code không bug",
      "Lương tăng gấp đôi",
      "Được lì xì nhiều",
      "Chúc Tết ba mẹ trước rồi tính tiếp",
    ],
    correctAnswer: 3,
    explanation: "Bug fix sau, tiền kiếm sau, ba mẹ mà quên chúc là toang thật 😏",
  },
  {
    question: "Phong tục nào KHÔNG nên làm vào mùng 1 Tết?",
    options: [
      "Quét nhà",
      "Deploy production",
      "Nói lời xui xẻo",
      "Cả 3 đều nên né",
    ],
    correctAnswer: 3,
    explanation: "Quét nhà mất lộc, nói xui mất hên, deploy thì mất Tết luôn 😭",
  },
  {
    question: "Lì xì thường được đựng trong gì?",
    options: ["Bao lì xì màu đỏ", "Túi nilon", "Mẹ cầm hộ", "Tất cả đều đúng"],
    correctAnswer: 0,
    explanation: "Chắc chắn là bao lì xì rồi, đừng đưa mẹ cầm hộ nhé =))",
  },
  {
    question: "Khi được lì xì, câu trả lời nào là “chuẩn bài” nhất?",
    options: [
      "Ủa ít vậy ạ? 🥺",
      "Con cảm ơn ạ, chúc cô/chú năm mới nhiều sức khỏe ạ",
      "Graphene là vật liệu mỏng thứ 2 thế giới, chỉ sau cái bao lì xì này",
      "Chuyển khoản cho con khỏi giữ tiền mặt nha",
    ],
    correctAnswer: 1,
    explanation: "Vừa ngoan, vừa lịch sự, năm sau còn được lì xì tiếp 🧧",
  },
  {
    question: "Lý do hợp lý nhất để ‘trốn’ họp đầu năm?",
    options: [
      "Mạng yếu",
      "Micro hỏng",
      "Đang xông đất nhà người yêu",
      "Không có lý do nào hợp lý, hãy tham gia đi...",
    ],
    correctAnswer: 3,
    explanation: "Bạn có thể trốn, nhưng KPI thì không trốn bạn đâu 😌",
  },
  {
    question: "Trong ngày Tết, câu nói nào dễ gây ‘mất lòng’ nhất?",
    options: [
      '"Bao giờ lấy chồng/vợ?"',
      '"Dạo này tăng cân hả?"',
      '"Lương bao nhiêu rồi?"',
      '"Cả 3 câu trên, né hết giùm cái!"',
    ],
    correctAnswer: 3,
    explanation: "Tết là để vui, không phải buổi review cuộc đời người khác 😤",
  },
  {
    question: "Khi họ hàng hỏi: “Bao giờ mua nhà?”, bạn nên trả lời sao?",
    options: [
      '"Đợi trúng Vietlott ạ!"',
      '"Đợi lương tăng 10 lần ạ!"',
      '"Đợi giá đất giảm 90% ạ!"',
      '"Đợi cô/chú chuyển sổ đỏ sang tên con ạ!"',
    ],
    correctAnswer: 3,
    explanation: "Hỏi khó thì mình trả lời… khó lại thôi 😎",
  },
  {
    question: "Bánh chưng thường được gói bằng lá gì?",
    options: ["Lá chuối", "Lá dong", "Lá ngón", "Lá đu đủ"],
    correctAnswer: 1,
    explanation: "Lá dong là lá truyền thống để gói bánh chưng, gói lá ngón thì Tết năm sau ăn gà khoả thân",
  },
  {
    question: "Món nào NGUY HIỂM NHẤT với chiếc bụng ngày Tết?",
    options: [
      "Bánh chưng",
      "Mứt dừa",
      "Hạt dưa",
      "Mâm cỗ + lời rủ: “Ăn đi, có sao đâu!”",
    ],
    correctAnswer: 3,
    explanation: "Nguy hiểm nhất không phải món ăn, mà là người liên tục gắp cho bạn 😂",
  },
  {
    question: "Thời điểm hợp lý nhất để… bắt đầu giảm cân sau Tết là khi nào?",
    options: [
      "Mùng 4",
      "Rằm tháng Giêng",
      "Sau Tết Đoan Ngọ",
      "Thôi để… Tết năm sau",
    ],
    correctAnswer: 1,
    explanation: "Nói vậy thôi chứ 90% chọn đáp án 3 hoặc 4 😅",
  },
  {
    question: "Món ăn nào là món truyền thống ngày Tết?",
    options: ["Bánh chưng", "Beefsteak cháy cạnh", "Pizza", "Sashimi cá hồi"],
    correctAnswer: 0,
    explanation: "Bánh chưng là món truyền thống Tết Việt Nam",
  },
  {
    question: "Nếu sếp mùng 1 Tết nhắn: “Em rảnh không?”, bạn nên làm gì?",
    options: [
      "Giả vờ… chưa thấy tin nhắn",
      "Trả lời: “Dạ em đang đi chúc Tết ạ”",
      "Nhắn lại: “Anh rảnh không? Em review lương tí!”",
      "Cả 3 đều là kỹ năng sinh tồn",
    ],
    correctAnswer: 3,
    explanation: "Kỹ năng né việc & đòi lương phải luyện quanh năm, không chỉ ngày Tết 🤭",
  },
  {
    question: "Bao lì xì nào ‘đau tim’ nhất?",
    options: [
      "Bao dày, cứng, mở ra toàn tiền lẻ",
      "Bao mỏng, xẹp, nhưng toàn tiền to",
      "Bao có 1 tờ… nhưng là đô la",
      "Bao rất đẹp… nhưng bên trong là lời chúc",
    ],
    correctAnswer: 3,
    explanation: "Lời chúc là vô giá… nhưng trái tim vật chất thì hơi nhói 😌",
  },
  {
    question: "Mục tiêu thực tế nhất cho năm mới là gì?",
    options: [
      "Không OT",
      "Không bug",
      "Không ăn khuya",
      "Chấp nhận sự thật là 3 cái trên không làm được",
    ],
    correctAnswer: 3,
    explanation: "Nhận thức được giới hạn của bản thân cũng là một dạng trưởng thành 😇",
  },
];

// Câu hỏi riêng dành cho BOD (Board of Directors)
export const BOD_QUESTIONS: Question[] = [
  {
    question: "Món quà Tết nào BOD nên tặng nhân viên?",
    options: [
      "Bánh kẹo truyền thống",
      "Lì xì may mắn",
      "Lời chúc Tết chân thành",
      "Cả 3 đều ý nghĩa, nhưng lì xì + lời chúc là combo hoàn hảo!",
    ],
    correctAnswer: 3,
    explanation: "Lì xì là văn hóa, lời chúc là tình cảm. Kết hợp cả hai là tuyệt vời nhất! 🧧",
  },
  {
    question: "BOD nên lì xì nhân viên bao nhiêu là 'chuẩn bài'?",
    options: [
      "Tùy theo performance review",
      "Tùy theo số năm làm việc",
      "Tùy theo... tình hình tài chính công ty",
      "Lì xì là tình cảm, không nên tính toán!",
    ],
    correctAnswer: 3,
    explanation: "Lì xì là văn hóa, là tình cảm. Nhưng nhiều vẫn tốt hơn ạ 🧧",
  },
  {
    question: "Câu nói nào của BOD dễ tạo động lực nhất cho nhân viên?",
    options: [
      '"Năm nay chúng ta sẽ làm việc hiệu quả hơn"',
      '"Anh/chị tin team sẽ đạt được mục tiêu"',
      '"Cảm ơn mọi người đã đồng hành, chúng ta cùng phát triển!"',
      '"Cả 3 đều tốt, nhưng lời cảm ơn chân thành luôn có sức mạnh lớn nhất"',
    ],
    correctAnswer: 3,
    explanation: "Lời cảm ơn chân thành từ lãnh đạo luôn là động lực lớn nhất! 💪",
  },
];

/**
 * Lấy một câu hỏi ngẫu nhiên
 * @param role - Role của người chơi (optional), nếu là BOD thì sẽ lấy từ cả câu hỏi thường và câu hỏi riêng
 */
export function getRandomQuestion(role?: string): Question {
  // Kiểm tra nếu role là BOD thì gộp cả câu hỏi thường và câu hỏi riêng
  if (role && role.toLowerCase().includes("bod")) {
    const allQuestions = [...QUESTIONS, ...BOD_QUESTIONS];
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    return allQuestions[randomIndex];
  }
  // Mặc định dùng câu hỏi thường
  const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
  return QUESTIONS[randomIndex];
}

/**
 * Kiểm tra đáp án có đúng không
 */
export function checkAnswer(question: Question, selectedAnswer: number): boolean {
  return question.correctAnswer === selectedAnswer;
}
