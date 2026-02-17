// Utility để quản lý trạng thái đã chơi của user trên Firebase
// Fallback về localStorage nếu Firebase chưa được config

export interface PlayStatus {
  hasPlayed: boolean;
  amountWon: number;
  name: string;
  role: string;
  timestamp: number;
}

const LS_KEY = "luckyMoney";
const FIREBASE_PATH = "playedUsers"; // Path trong Firebase Realtime Database

/**
 * Tạo hoặc lấy User ID từ localStorage
 * Mỗi browser sẽ có một ID duy nhất
 */
function getUserId(): string {
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
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
    return !!apiKey && !!databaseURL && 
           apiKey !== "YOUR_API_KEY" && 
           databaseURL !== "YOUR_DATABASE_URL";
  } catch {
    return false;
  }
}

/**
 * Lấy trạng thái đã chơi từ localStorage (fallback)
 */
function getPlayStatusLocal(): PlayStatus | null {
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
    };
  } catch {
    return null;
  }
}

/**
 * Lưu trạng thái đã chơi vào localStorage (fallback)
 */
function savePlayStatusLocal(status: PlayStatus): void {
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
    // @ts-ignore - Firebase có thể chưa được cài đặt
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
    };
  } catch (error: any) {
    // Kiểm tra nếu là lỗi permission, log và fallback
    if (error?.code === "PERMISSION_DENIED" || error?.message?.includes("Permission denied")) {
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
export async function savePlayStatus(amountWon: number, name: string, role: string): Promise<void> {
  const status: PlayStatus = {
    hasPlayed: true,
    amountWon,
    name,
    role,
    timestamp: Date.now(),
  };

  if (!isFirebaseConfigured()) {
    savePlayStatusLocal(status);
    return;
  }

  try {
    // @ts-ignore - Firebase có thể chưa được cài đặt
    const firebaseDb = await import("firebase/database").catch(() => null);
    const firebaseApp = await import("./firebase").catch(() => null);
    
    if (!firebaseDb || !firebaseApp) {
      savePlayStatusLocal(status);
      return;
    }

    const { ref, set } = firebaseDb;
    const { database } = firebaseApp;
    
    if (!database) {
      savePlayStatusLocal(status);
      return;
    }

    const userId = getUserId();
    await set(ref(database, `${FIREBASE_PATH}/${userId}`), status);
  } catch (error: any) {
    // Kiểm tra nếu là lỗi permission, log và fallback
    if (error?.code === "PERMISSION_DENIED" || error?.message?.includes("Permission denied")) {
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
