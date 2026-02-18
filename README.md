## Lucky Red Envelope – Next.js Edition 🧧

Ứng dụng mini-game lì xì đầu năm: người chơi chọn tên + role, trả lời câu đố về Tết, nếu vượt qua mới được cào thẻ nhận lì xì. Kết quả được lưu chung qua Firebase Realtime Database (nếu cấu hình), kèm leaderboard.

### Công nghệ sử dụng

- **Next.js 14 (App Router, TypeScript)**
- **React** + **framer-motion** (animation)
- **Tailwind CSS** + **shadcn-ui**
- **Firebase Realtime Database** (tùy chọn, cho shared leaderboard & play status)

### Chuẩn bị môi trường

- Node.js LTS (khuyến nghị dùng qua `nvm`)
- `npm` hoặc `yarn` (project hiện dùng `npm`)

### Cài đặt & chạy dev

```bash
# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Ứng dụng mặc định chạy ở `http://localhost:3000`.

### Cấu hình Firebase (khuyến nghị)

Nếu không cấu hình Firebase, app vẫn chạy được nhưng sẽ fallback về `localStorage` (leaderboard và play status chỉ trên máy hiện tại).

1. Tạo file `.env.local` ở root (cùng cấp với `package.json`)
2. Điền thông tin từ Firebase Console (Project Settings → Your apps → Web app config):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Cấu hình **Realtime Database Rules** để cho phép đọc/ghi phù hợp cho:
   - `leaderboard`
   - `playedUsers`

### Lint & build

```bash
# Kiểm tra lint
npm run lint

# Build production
npm run build
```

### Ghi chú kiến trúc

- `app/IndexClient.tsx`: toàn bộ flow game (landing → quiz → scratch → result/already)
- `src/lib/*`: logic business (lottery, leaderboard, playStatus, Firebase, questions, greetings)
- `src/components/*`: UI components (ScratchCard, LandingScreen, ResultScreen, QuizScreen, Leaderboard, v.v.)
