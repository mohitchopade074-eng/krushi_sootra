// KRUSHI-SOOTRA (कृषी-सूत्र)
// Firebase Modular Service (Authentication, Firestore, Storage)

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your actual Firebase Project credentials
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "krushi-sootra.firebaseapp.com",
  projectId: "krushi-sootra",
  storageBucket: "krushi-sootra.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase safely
let app;
let auth;
let db;
let storage;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn('Firebase initialization warning (Provide keys to activate full live sync):', error?.message);
}

export { app, auth, db, storage };
