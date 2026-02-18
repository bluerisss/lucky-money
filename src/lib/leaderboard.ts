// Utility để quản lý Leaderboard chung (shared) sử dụng Firebase Realtime Database
// Fallback về localStorage nếu Firebase chưa được config

export interface LeaderboardEntry {
  name: string; // Tên của người chơi
  role: string; // Vai trò của người chơi
  amount: number; // Số tiền nhận được
  emoji: string; // Emoji tương ứng với role
  timestamp: number; // Thời gian chơi (để sort nếu cùng số tiền)
  quizFailed?: boolean; // true nếu trả lời sai hết 5 lượt
  id?: string; // ID từ Firebase (nếu có)
}

const LEADERBOARD_KEY = "luckyMoneyLeaderboard";
const MAX_ENTRIES = 100; // Giới hạn số lượng entry trên Firebase
const FIREBASE_PATH = "leaderboard"; // Path trong Firebase Realtime Database

// Map role -> emoji
const ROLE_EMOJI_MAP: Record<string, string> = {
  developer: "🧑‍💻",
  dev: "🧑‍💻",
  hr: "👩‍💼",
  devops: "🔧",
  designer: "🎨",
  pm: "📋",
  ceo: "👔",
  tester: "🐛",
  qa: "🐛",
  ba: "📊",
  sales: "💼",
  bod: "👑",
};

function getEmojiForRole(role: string): string {
  const key = role.toLowerCase().trim();
  for (const [roleKey, emoji] of Object.entries(ROLE_EMOJI_MAP)) {
    if (key.includes(roleKey) || roleKey.includes(key)) {
      return emoji;
    }
  }
  // Default emoji nếu không match
  return "🧧";
}

/**
 * Kiểm tra xem Firebase có được config chưa (sync version)
 */
function isFirebaseConfigured(): boolean {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    const isConfigured = !!apiKey && !!databaseURL && 
           apiKey !== "YOUR_API_KEY" && 
           databaseURL !== "YOUR_DATABASE_URL" &&
           !databaseURL.includes("YOUR_DATABASE_URL");
    return isConfigured;
  } catch {
    return false;
  }
}

/**
 * Lấy danh sách leaderboard từ localStorage (fallback)
 * Chỉ chạy trên client (browser)
 */
function getLeaderboardLocal(): LeaderboardEntry[] {
  if (typeof window === "undefined") return []; // Server-side: return empty array
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!isFirebaseConfigured()) {
    return getLeaderboardLocal();
  }

  try {
    const firebaseDb = await import("firebase/database").catch(() => null);
    const firebaseApp = await import("./firebase").catch(() => null);
    
    if (!firebaseDb || !firebaseApp) {
      return getLeaderboardLocal();
    }

    const { ref, get } = firebaseDb;
    const { database } = firebaseApp;
    
    if (!database) {
      return getLeaderboardLocal();
    }
    
    const snapshot = await get(ref(database, FIREBASE_PATH));
    
    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    // Convert Firebase object thành array
    return Object.entries(data || {}).map(([id, entry]: [string, unknown]) => ({
      ...(entry as LeaderboardEntry),
      id,
    })) as LeaderboardEntry[];
  } catch (error: unknown) {
    // Kiểm tra nếu là lỗi permission, log và fallback
    const firebaseError = error as { code?: string; message?: string };
    if (firebaseError?.code === "PERMISSION_DENIED" || firebaseError?.message?.includes("Permission denied")) {
      console.warn("⚠️ Firebase Database Rules chưa được cấu hình. Đang dùng localStorage làm fallback.");
      console.warn("💡 Hãy cấu hình Database Rules trong Firebase Console để sử dụng leaderboard chung.");
    } else {
      console.error("Lỗi khi lấy leaderboard từ Firebase:", error);
    }
    // Fallback về localStorage
    return getLeaderboardLocal();
  }
}

/**
 * Thêm entry mới vào leaderboard (Firebase hoặc localStorage)
 */
export async function addToLeaderboard(name: string, role: string, amount: number, quizFailed: boolean = false): Promise<void> {
  const newEntry: LeaderboardEntry = {
    name,
    role,
    amount,
    emoji: getEmojiForRole(role),
    timestamp: Date.now(),
    quizFailed,
  };

  if (!isFirebaseConfigured()) {
    // Fallback: lưu vào localStorage (chỉ trên client)
    if (typeof window !== "undefined") {
      const entries = getLeaderboardLocal();
      entries.unshift(newEntry);
      if (entries.length > MAX_ENTRIES) {
        entries.splice(MAX_ENTRIES);
      }
      try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
      } catch (error) {
        console.error("Không thể lưu leaderboard:", error);
      }
    }
    return;
  }

  // Lưu vào Firebase
  try {
    // Dynamic import để tránh lỗi nếu Firebase chưa được cài
    const firebaseDb = await import("firebase/database").catch(() => null);
    const firebaseApp = await import("./firebase").catch(() => null);
    
    if (!firebaseDb || !firebaseApp) {
      console.warn("⚠️ Không thể import Firebase modules. Đang dùng localStorage.");
      // Fallback về localStorage (chỉ trên client)
      if (typeof window !== "undefined") {
        const entries = getLeaderboardLocal();
        entries.unshift(newEntry);
        if (entries.length > MAX_ENTRIES) {
          entries.splice(MAX_ENTRIES);
        }
        try {
          localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
        } catch (e) {
          console.error("Không thể lưu leaderboard:", e);
        }
      }
      return;
    }

    const { ref, push, set, get } = firebaseDb;
    const { database } = firebaseApp;
    
    if (!database) {
      console.warn("⚠️ Firebase database chưa được khởi tạo. Đang dùng localStorage.");
      // Fallback về localStorage (chỉ trên client)
      if (typeof window !== "undefined") {
        const entries = getLeaderboardLocal();
        entries.unshift(newEntry);
        if (entries.length > MAX_ENTRIES) {
          entries.splice(MAX_ENTRIES);
        }
        try {
          localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
        } catch (e) {
          console.error("Không thể lưu leaderboard:", e);
        }
      }
      return;
    }
    
    // Thêm entry mới
    console.log("💾 Đang lưu leaderboard entry vào Firebase:", newEntry);
    const newEntryRef = push(ref(database, FIREBASE_PATH));
    await set(newEntryRef, newEntry);
    console.log("✅ Đã lưu leaderboard entry vào Firebase thành công");

    // Giới hạn số lượng entries (giữ lại top MAX_ENTRIES)
    // Lấy tất cả entries và sort trong code để tránh cần index trong Rules
    const leaderboardRef = ref(database, FIREBASE_PATH);
    const allSnapshot = await get(leaderboardRef);
    
    if (allSnapshot.exists()) {
      const allData = allSnapshot.val();
      const entries = Object.entries(allData || {}).map(([id, entry]: [string, unknown]) => ({
        ...(entry as LeaderboardEntry),
        id,
      })) as LeaderboardEntry[];

      // Sort theo timestamp (mới nhất trước) và giữ lại MAX_ENTRIES
      const sortedEntries = entries
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, MAX_ENTRIES);

      const keepIds = new Set(sortedEntries.map(e => e.id));

      // Xóa các entries không nằm trong top MAX_ENTRIES
      for (const id of Object.keys(allData)) {
        if (!keepIds.has(id)) {
          await set(ref(database, `${FIREBASE_PATH}/${id}`), null);
        }
      }
    }
  } catch (error: unknown) {
    // Kiểm tra nếu là lỗi permission, log và fallback
    const firebaseError = error as { code?: string; message?: string };
    if (firebaseError?.code === "PERMISSION_DENIED" || firebaseError?.message?.includes("Permission denied")) {
      console.warn("⚠️ Firebase Database Rules chưa được cấu hình. Đang lưu vào localStorage.");
      console.warn("💡 Hãy cấu hình Database Rules trong Firebase Console để sử dụng leaderboard chung.");
    } else {
      console.error("Lỗi khi lưu leaderboard vào Firebase:", error);
    }
    // Fallback về localStorage (chỉ trên client)
    if (typeof window !== "undefined") {
      const entries = getLeaderboardLocal();
      entries.unshift(newEntry);
      if (entries.length > MAX_ENTRIES) {
        entries.splice(MAX_ENTRIES);
      }
      try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
      } catch (e) {
        console.error("Không thể lưu leaderboard:", e);
      }
    }
  }
}

/**
 * Xóa toàn bộ leaderboard (utility function, có thể dùng để reset)
 */
export async function clearLeaderboard(): Promise<void> {
  if (typeof window === "undefined") return; // Server-side: skip
  
  if (!isFirebaseConfigured()) {
    localStorage.removeItem(LEADERBOARD_KEY);
    return;
  }

  try {
    const firebaseDb = await import("firebase/database").catch(() => null);
    const firebaseApp = await import("./firebase").catch(() => null);
    
    if (!firebaseDb || !firebaseApp) {
      localStorage.removeItem(LEADERBOARD_KEY);
      return;
    }

    const { ref, set } = firebaseDb;
    const { database } = firebaseApp;
    await set(ref(database, FIREBASE_PATH), null);
  } catch (error) {
    console.error("Lỗi khi xóa leaderboard:", error);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LEADERBOARD_KEY);
    }
  }
}

/**
 * Lấy top N entries (đã sort theo amount giảm dần)
 */
export async function getTopEntries(limit: number = 10): Promise<LeaderboardEntry[]> {
  const entries = await getLeaderboard();
  return entries
    .sort((a, b) => {
      // Quiz failed entries xuống cuối
      if (a.quizFailed && !b.quizFailed) return 1;
      if (!a.quizFailed && b.quizFailed) return -1;
      // Sort theo amount giảm dần, nếu cùng amount thì sort theo timestamp (mới hơn trước)
      if (b.amount !== a.amount) {
        return b.amount - a.amount;
      }
      return b.timestamp - a.timestamp;
    })
    .slice(0, limit);
}

/**
 * Subscribe để lắng nghe thay đổi real-time từ Firebase
 * Trả về function để unsubscribe
 */
export function subscribeToLeaderboard(
  callback: (entries: LeaderboardEntry[]) => void
): (() => void) | null {
  if (!isFirebaseConfigured()) {
    // Fallback: không có real-time cho localStorage
    return null;
  }

  let unsubscribe: (() => void) | null = null;

  // Dynamic import để tránh lỗi nếu Firebase chưa được cài
  Promise.all([
    import("firebase/database").catch(() => null),
    import("./firebase").catch(() => null),
  ]).then(([firebaseDb, firebaseApp]) => {
    if (!firebaseDb || !firebaseApp) {
      return;
    }

    try {
      const { ref, onValue } = firebaseDb;
      const { database } = firebaseApp;
      const leaderboardRef = ref(database, FIREBASE_PATH);
      
      unsubscribe = onValue(leaderboardRef, (snapshot) => {
        if (!snapshot.exists()) {
          callback([]);
          return;
        }

        const data = snapshot.val();
        const entries = Object.entries(data || {}).map(([id, entry]: [string, unknown]) => ({
          ...(entry as LeaderboardEntry),
          id,
        })) as LeaderboardEntry[];

        // Sort và trả về
        const sorted = entries
          .sort((a, b) => {
            if (b.amount !== a.amount) {
              return b.amount - a.amount;
            }
            return b.timestamp - a.timestamp;
          })
          .slice(0, 10);

        callback(sorted);
      });
    } catch (error) {
      console.error("Lỗi khi subscribe leaderboard:", error);
    }
  }).catch((error) => {
    console.error("Lỗi khi load Firebase:", error);
  });

  // Return unsubscribe function
  return unsubscribe ? () => unsubscribe?.() : null;
}
