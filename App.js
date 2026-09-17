// KRUSHI-SOOTRA (कृषी-सूत्र)
// Main Application Entry Point

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FarmerHomeScreen from './screens/FarmerHomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <FarmerHomeScreen />
    </SafeAreaProvider>
  );
}
