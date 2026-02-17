const GREETINGS: Record<string, string[]> = {
  developer: [
    "Chúc bạn năm mới deploy không bug, merge không conflict! 🚀",
    "Năm mới code chạy ngon, deadline dài, bug biến mất! 💻",
    "Chúc năm mới git push thành công từ lần đầu, không bao giờ phải force push! 🎯",
  ],
  hr: [
    "Chúc bạn tuyển đâu trúng đó, không dính drama! 🎯",
    "Năm mới ứng viên xếp hàng, nhân sự vui như Tết! 🧧",
    "Chúc HR năm nay KPI vượt target, team nào cũng đủ người! 💪",
  ],
  devops: [
    "Chúc năm nay production không cháy lúc 2h sáng! 🔥",
    "Năm mới uptime 99.99%, alert im re, ngủ ngon giấc! 😴",
    "Chúc server luôn xanh, deploy tự động, không bao giờ rollback! 🟢",
  ],
  designer: [
    "Chúc năm mới pixel perfect, client duyệt từ lần đầu! 🎨",
    "Năm mới sáng tạo bùng nổ, Figma không lag! ✨",
    "Chúc designer năm nay không ai nói 'làm logo to hơn' nữa! 😂",
  ],
  pm: [
    "Chúc PM năm mới scope không creep, timeline luôn đúng hạn! 📊",
    "Năm mới stakeholder luôn hài lòng, meeting ngắn gọn! 🎯",
    "Chúc năm nay sprint nào cũng đạt velocity, retro toàn điều vui! 🏃",
  ],
  ceo: [
    "Chúc sếp năm mới revenue tăng gấp đôi, team vui vẻ! 📈",
    "Năm mới funding dồi dào, vision thành hiện thực! 🚀",
    "Chúc CEO năm nay IPO thành công, Forbes gọi tên! 💰",
  ],
  tester: [
    "Chúc QA năm mới tìm bug nhanh, dev fix còn nhanh hơn! 🐛",
    "Năm mới test case pass hết, regression bằng 0! ✅",
    "Chúc tester năm nay automation chạy mượt, manual test biến mất! 🤖",
  ],
  default: [
    "Chúc bạn năm mới Tấn Tài Tấn Lộc, vạn sự như ý! 🧧",
    "Năm mới phát tài phát lộc, công việc thuận lợi! 💰",
    "Chúc mừng năm mới! Sức khỏe dồi dào, tiền vào như nước! 🎉",
  ],
};

export function getGreeting(role: string): string {
  const key = role.toLowerCase().trim();
  const matchedKey = Object.keys(GREETINGS).find(
    (k) => key.includes(k) || k.includes(key)
  );
  const greetings = GREETINGS[matchedKey || "default"];
  return greetings[Math.floor(Math.random() * greetings.length)];
}
