// KRUSHI-SOOTRA (कृषी-सूत्र)
// Secure Firebase Modular Configuration using Environment Variables (.env)

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Read credentials securely from environment variables (.env)
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "krushi-sootra.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "krushi-sootra",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "krushi-sootra.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Initialize Firebase safely
let app;
let auth;
let db;
let storage;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    auth = getAuth(app);
  }

  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn('Firebase initialization warning:', error?.message);
}

export { app, auth, db, storage };
