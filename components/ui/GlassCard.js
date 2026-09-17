// KRUSHI-SOOTRA (कृषी-सूत्र)
// Luxury Frosted Glass Card Component (BlurView + Translucent Glass Border)

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Radii, Shadows } from '../../constants/theme';
import GlassPressable from './GlassPressable';

export default function GlassCard({
  children,
  style,
  intensity = 60,
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

  const content = (
    <View style={styles.innerContent}>
      {children}
    </View>
  );

  // For interactive cards, wrap with physics-based GlassPressable
  if (onPress) {
    return (
      <GlassPressable onPress={onPress} style={containerStyle} {...props}>
        {!isWeb ? (
          <BlurView intensity={intensity} tint={tint} style={styles.blurContainer}>
            {content}
          </BlurView>
        ) : (
          <View style={styles.webFallbackContainer}>
            {content}
          </View>
        )}
      </GlassPressable>
    );
  }

  return (
    <View style={containerStyle} {...props}>
      {!isWeb ? (
        <BlurView intensity={intensity} tint={tint} style={styles.blurContainer}>
          {content}
        </BlurView>
      ) : (
        <View style={styles.webFallbackContainer}>
          {content}
        </View>
      )}
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
  },
  cardGlow: {
    borderColor: Colors.glassBorderGlow,
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  blurContainer: {
    width: '100%',
    height: '100%',
  },
  webFallbackContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    backdropFilter: 'blur(20px)',
  },
  innerContent: {
    width: '100%',
  },
});
