// KRUSHI-SOOTRA (कृषी-सूत्र)
// Apple HIG Grouped Inset Card Surface

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '../../constants/theme';

export default function PremiumCard({
  children,
  style,
  onPress,
  variant = 'default', // 'default' | 'mint' | 'elevated' | 'outlined'
  padding = Spacing.lg,
  ...props
}) {
  const isPressable = typeof onPress === 'function';
  const Component = isPressable ? TouchableOpacity : View;

  const getVariantStyle = () => {
    switch (variant) {
      case 'mint':
        return styles.mintCard;
      case 'elevated':
        return styles.elevatedCard;
      case 'outlined':
        return styles.outlinedCard;
      default:
        return styles.defaultCard;
    }
  };

  return (
    <Component
      style={[
        styles.base,
        getVariantStyle(),
        { padding },
        style,
      ]}
      onPress={onPress}
      activeOpacity={isPressable ? 0.85 : 1}
      {...props}
    >
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.xxl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  defaultCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  mintCard: {
    backgroundColor: Colors.mintTint,
    borderWidth: 1.5,
    borderColor: Colors.mintBorder,
    ...Shadows.subtle,
  },
  elevatedCard: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 0,
    ...Shadows.prominent,
  },
  outlinedCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
  },
});
