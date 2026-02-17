// Firebase configuration cho Client SDK (Frontend)
// Bạn cần lấy config từ Firebase Console > Project Settings > Your apps > Web app config
// Hướng dẫn: https://firebase.google.com/docs/web/setup

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

// Firebase Web App Configuration
// Lấy từ Firebase Console > Project Settings > Your apps > Config
// Hoặc dùng environment variables trong file .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "luckymoney-ed093.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://luckymoney-ed093-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "luckymoney-ed093",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "luckymoney-ed093.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
};

// Kiểm tra xem Firebase đã được config chưa
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY" && 
                     firebaseConfig.databaseURL !== "YOUR_DATABASE_URL";

let app: FirebaseApp | null = null;
let database: Database | null = null;

if (isConfigured) {
  try {
    // Initialize Firebase App
    app = initializeApp(firebaseConfig);
    
    // Initialize Realtime Database
    database = getDatabase(app);
  } catch (error) {
    console.error("Lỗi khi khởi tạo Firebase:", error);
  }
}

// Export database và app (có thể null nếu chưa config)
export { database, app };
export default app;
