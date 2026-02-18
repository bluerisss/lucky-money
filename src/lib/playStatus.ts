// Utility để quản lý trạng thái đã chơi của user trên Firebase
// Fallback về localStorage nếu Firebase chưa được config

export interface PlayStatus {
  hasPlayed: boolean;
  amountWon: number;
  name: string;
  role: string;
  timestamp: number;
  quizFailed?: boolean; // true nếu trả lời sai hết 5 lượt
}

const LS_KEY = "luckyMoney";
const FIREBASE_PATH = "playedUsers"; // Path trong Firebase Realtime Database

/**
 * Tạo hoặc lấy User ID từ localStorage
 * Mỗi browser sẽ có một ID duy nhất
 * Chỉ chạy trên client (browser)
 */
function getUserId(): string {
  if (typeof window === "undefined") {
    // Server-side: return temporary ID (sẽ được tạo lại trên client)
    return `temp_${Date.now()}`;
  }
  
  const USER_ID_KEY = "luckyMoneyUserId";
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    // Tạo ID mới nếu chưa có
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
}

/**
 * Kiểm tra xem Firebase có được config chưa
 */
function isFirebaseConfigured(): boolean {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    const isConfigured = !!apiKey && !!databaseURL && 
           apiKey !== "YOUR_API_KEY" && 
           databaseURL !== "YOUR_DATABASE_URL" &&
           !databaseURL.includes("YOUR_DATABASE_URL");
    
    if (!isConfigured) {
      console.warn("⚠️ Firebase chưa được cấu hình. Đang dùng localStorage.");
    }
    
    return isConfigured;
  } catch {
    return false;
  }
}

/**
 * Lấy trạng thái đã chơi từ localStorage (fallback)
 * Chỉ chạy trên client (browser)
 */
function getPlayStatusLocal(): PlayStatus | null {
  if (typeof window === "undefined") return null; // Server-side: return null
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      hasPlayed: data.hasPlayed || false,
      amountWon: data.amountWon || 0,
      name: data.name || "",
      role: data.role || "",
      timestamp: data.timestamp || Date.now(),
      quizFailed: data.quizFailed || false,
    };
  } catch {
    return null;
  }
}

/**
 * Lưu trạng thái đã chơi vào localStorage (fallback)
 * Chỉ chạy trên client (browser)
 */
function savePlayStatusLocal(status: PlayStatus): void {
  if (typeof window === "undefined") return; // Server-side: skip
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(status));
  } catch (error) {
    console.error("Không thể lưu trạng thái chơi:", error);
  }
}

/**
 * Lấy trạng thái đã chơi từ Firebase hoặc localStorage
 */
export async function getPlayStatus(): Promise<PlayStatus | null> {
  if (!isFirebaseConfigured()) {
    return getPlayStatusLocal();
  }

  try {
    const firebaseDb = await import("firebase/database").catch(() => null);
    const firebaseApp = await import("./firebase").catch(() => null);
    
    if (!firebaseDb || !firebaseApp) {
      return getPlayStatusLocal();
    }

    const { ref, get } = firebaseDb;
    const { database } = firebaseApp;
    
    if (!database) {
      return getPlayStatusLocal();
    }

    const userId = getUserId();
    const snapshot = await get(ref(database, `${FIREBASE_PATH}/${userId}`));
    
    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.val();
    return {
      hasPlayed: data.hasPlayed || false,
      amountWon: data.amountWon || 0,
      name: data.name || "",
      role: data.role || "",
      timestamp: data.timestamp || Date.now(),
      quizFailed: data.quizFailed || false,
    };
  } catch (error: unknown) {
    // Kiểm tra nếu là lỗi permission, log và fallback
    const firebaseError = error as { code?: string; message?: string };
    if (firebaseError?.code === "PERMISSION_DENIED" || firebaseError?.message?.includes("Permission denied")) {
      console.warn("⚠️ Firebase Database Rules chưa được cấu hình cho playedUsers. Đang dùng localStorage.");
    } else {
      console.error("Lỗi khi lấy trạng thái chơi từ Firebase:", error);
    }
    // Fallback về localStorage
    return getPlayStatusLocal();
  }
}

/**
 * Lưu trạng thái đã chơi vào Firebase hoặc localStorage
 */
export async function savePlayStatus(amountWon: number, name: string, role: string, quizFailed: boolean = false): Promise<void> {
  const status: PlayStatus = {
    hasPlayed: true,
    amountWon,
    name,
    role,
    timestamp: Date.now(),
    quizFailed,
  };

  if (!isFirebaseConfigured()) {
    savePlayStatusLocal(status);
    return;
  }

  try {
    const firebaseDb = await import("firebase/database").catch(() => null);
    const firebaseApp = await import("./firebase").catch(() => null);
    
    if (!firebaseDb || !firebaseApp) {
      console.warn("⚠️ Không thể import Firebase modules. Đang dùng localStorage.");
      savePlayStatusLocal(status);
      return;
    }

    const { ref, set } = firebaseDb;
    const { database } = firebaseApp;
    
    if (!database) {
      console.warn("⚠️ Firebase database chưa được khởi tạo. Đang dùng localStorage.");
      savePlayStatusLocal(status);
      return;
    }

    const userId = getUserId();
    const path = `${FIREBASE_PATH}/${userId}`;
    console.log("💾 Đang lưu playStatus vào Firebase:", path, status);
    await set(ref(database, path), status);
    console.log("✅ Đã lưu playStatus vào Firebase thành công");
  } catch (error: unknown) {
    // Kiểm tra nếu là lỗi permission, log và fallback
    const firebaseError = error as { code?: string; message?: string };
    if (firebaseError?.code === "PERMISSION_DENIED" || firebaseError?.message?.includes("Permission denied")) {
      console.warn("⚠️ Firebase Database Rules chưa được cấu hình cho playedUsers. Đang lưu vào localStorage.");
    } else {
      console.error("Lỗi khi lưu trạng thái chơi vào Firebase:", error);
    }
    // Fallback về localStorage
    savePlayStatusLocal(status);
  }
}

/**
 * Kiểm tra xem user đã chơi chưa (sync version - dùng cho initial check)
 */
export function hasPlayedSync(): boolean {
  const local = getPlayStatusLocal();
  return local?.hasPlayed || false;
}
