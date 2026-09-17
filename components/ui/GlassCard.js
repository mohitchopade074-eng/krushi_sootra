// KRUSHI-SOOTRA (कृषी-सूत्र)
// Luxury Frosted Glass Card Component (BlurView + Translucent Glass Border)

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Radii } from '../../constants/theme';
import GlassPressable from './GlassPressable';

export default function GlassCard({
  children,
  style,
  intensity = 50,
  tint = 'light',
  onPress,
  borderGlow = false,
  ...props
}) {
  const isWeb = Platform.OS === 'web';

  const containerStyle = [
    styles.card,
    borderGlow && styles.cardGlow,
    style,
  ];

  const backgroundLayer = !isWeb ? (
    <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFillObject} />
  ) : (
    <View style={[StyleSheet.absoluteFillObject, styles.webFallbackContainer]} />
  );

  if (onPress) {
    return (
      <GlassPressable style={containerStyle} onPress={onPress} {...props}>
        {backgroundLayer}
        {children}
      </GlassPressable>
    );
  }

  return (
    <View style={containerStyle} {...props}>
      {backgroundLayer}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.xxl,
    overflow: 'hidden',
    backgroundColor: Colors.glassSurface,
    borderWidth: 1.2,
    borderColor: Colors.glassBorder,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
    position: 'relative',
  },
  cardGlow: {
    borderColor: Colors.glassBorderGlow,
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  webFallbackContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(20px)',
  },
});
