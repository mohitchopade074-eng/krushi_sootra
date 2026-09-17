// KRUSHI-SOOTRA (कृषी-सूत्र)
// Main Application Controller with Apple HIG Bottom Navigation & Multi-Role Support

import React, { useState } from 'react';
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

// Initial dummy booking for realistic showcase
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

  const handleAddBooking = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
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
            onRoleChange={setCurrentRole}
            currentLanguage={language}
            onLanguageChange={setLanguage}
            bookings={bookings}
          />
        );
      case 'home':
      default:
        return (
          <FarmerHomeScreen
            language={language}
            onLanguageChange={setLanguage}
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
