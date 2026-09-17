// KRUSHI-SOOTRA (कृषी-सूत्र)
// Cloud Firestore Service & Double-Booking Prevention Engine

import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Save a new booking into Firestore with Double-Booking Prevention
 * @param {Object} bookingData
 */
export async function createUniversalBooking(bookingData) {
  try {
    const bookingsRef = collection(db, 'bookings');

    // Double-Booking Check: Verify if same resource is already Confirmed for overlapping date
    if (bookingData.resourceId && bookingData.date) {
      const q = query(
        bookingsRef,
        where('resourceId', '==', bookingData.resourceId),
        where('date', '==', bookingData.date),
        where('status', '==', 'Confirmed')
      );
      const existingSnap = await getDocs(q);
      if (!existingSnap.empty) {
        return {
          success: false,
          error: 'हे साधन या तारखेसाठी आधीच बुक केलेले आहे. कृपया दुसरी तारीख निवडा.',
          isDoubleBooking: true,
        };
      }
    }

    const docPayload = {
      ...bookingData,
      status: bookingData.status || 'Confirmed',
      paymentStatus: bookingData.paymentStatus || 'Pending',
      createdAt: serverTimestamp(),
      clientTimestamp: new Date().toISOString(),
    };

    const docRef = await addDoc(bookingsRef, docPayload);
    return {
      success: true,
      bookingId: docRef.id,
      data: docPayload,
    };
  } catch (error) {
    console.warn('Firestore booking creation error:', error?.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Real-time listener for user bookings
 * @param {Function} onUpdate Callback when bookings update
 */
export function subscribeToUniversalBookings(onUpdate, onError) {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...docSnap.data(),
          });
        });
        if (onUpdate) onUpdate(items);
      },
      (error) => {
        console.warn('Firestore bookings snapshot error:', error?.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Snapshot listener setup failed:', err?.message);
    return () => {};
  }
}

/**
 * Save a Soil Health Card OCR Report into Firestore
 */
export async function saveSoilHealthReport(reportData) {
  try {
    const soilRef = collection(db, 'soilReports');
    const payload = {
      ...reportData,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(soilRef, payload);
    return { success: true, reportId: docRef.id };
  } catch (error) {
    console.warn('Error saving soil report:', error?.message);
    return { success: false, error: error.message };
  }
}

/**
 * Save or update user profile and primary role in Firestore
 */
export async function saveUserProfile(userId, profileData) {
  try {
    const userDocRef = doc(db, 'users', userId || 'current_user');
    await setDoc(userDocRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Error saving user profile:', error?.message);
    return { success: false, error: error.message };
  }
}
