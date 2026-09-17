import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from './constants/theme';
import AppBottomNav from './components/AppBottomNav';

// Screens
import FarmerHomeScreen from './screens/FarmerHomeScreen';
import EquipmentScreen from './screens/EquipmentScreen';
import LabourScreen from './screens/LabourScreen';
import WarehouseScreen from './screens/WarehouseScreen';
import KisanLabScreen from './screens/KisanLabScreen';
import ProfileScreen from './screens/ProfileScreen';

// Services
import { createUniversalBooking, subscribeToUniversalBookings, saveUserProfile } from './services/firestoreService';

// Initial dummy booking for fallback & preview
const INITIAL_BOOKINGS = [
  {
    id: 'BK-108422',
    resourceType: 'equipment',
    resourceName: 'महिंद्रा ५७५ DI ट्रॅक्टर (1 दिवस)',
    providerName: 'बाळासाहेब जाधव',
    totalAmount: 1849,
    date: '16/09/2026',
    status: 'Confirmed',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState('mr'); // 'mr' | 'hi' | 'en'
  const [currentRole, setCurrentRole] = useState('farmer');
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  // Subscribe to real-time Cloud Firestore bookings
  useEffect(() => {
    const unsubscribe = subscribeToUniversalBookings(
      (firestoreBookings) => {
        if (firestoreBookings && firestoreBookings.length > 0) {
          setBookings(firestoreBookings);
        }
      },
      (err) => {
        console.warn('Firestore offline/read status:', err?.message);
      }
    );
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleAddBooking = async (newBooking) => {
    // Optimistic local update
    setBookings((prev) => [newBooking, ...prev]);

    // Persist to Cloud Firestore
    await createUniversalBooking(newBooking);
  };

  const handleRoleChange = async (newRole) => {
    setCurrentRole(newRole);
    await saveUserProfile('current_farmer', { primaryRole: newRole, language });
  };

  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    await saveUserProfile('current_farmer', { primaryRole: currentRole, language: newLang });
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'equipment':
        return (
          <EquipmentScreen
            language={language}
            onBookingConfirmed={handleAddBooking}
          />
        );
      case 'labour':
        return (
          <LabourScreen
            language={language}
            onBookingConfirmed={handleAddBooking}
          />
        );
      case 'storage':
        return (
          <WarehouseScreen
            language={language}
            onBookingConfirmed={handleAddBooking}
          />
        );
      case 'lab':
        return <KisanLabScreen language={language} />;
      case 'profile':
        return (
          <ProfileScreen
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
            bookings={bookings}
          />
        );
      case 'home':
      default:
        return (
          <FarmerHomeScreen
            language={language}
            onLanguageChange={handleLanguageChange}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onBookEquipment={(item) => setActiveTab('equipment')}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screenContainer}>
          {renderActiveScreen()}
        </View>

        {/* Apple HIG Bottom Navigation Toggle Bar */}
        <AppBottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          language={language}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
  },
});
