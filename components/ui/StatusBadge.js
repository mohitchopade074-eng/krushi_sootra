// KRUSHI-SOOTRA (कृषी-सूत्र)
// Status & Role Badge Component (Apple HIG Pill Design)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Spacing, Typography } from '../../constants/theme';

export default function StatusBadge({
  label,
  status = 'success', // 'success' | 'warning' | 'error' | 'info' | 'neutral'
  icon,
  size = 'medium',    // 'small' | 'medium'
  style,
}) {
  const getBadgeColors = () => {
    switch (status) {
      case 'success':
        return {
          bg: Colors.successLight,
          text: Colors.success,
          border: '#A7F3D0',
          iconColor: Colors.success,
        };
      case 'warning':
        return {
          bg: Colors.warningLight,
          text: '#B45309',
          border: '#FDE68A',
          iconColor: '#B45309',
        };
      case 'error':
        return {
          bg: Colors.errorLight,
          text: Colors.error,
          border: '#FECACA',
          iconColor: Colors.error,
        };
      case 'info':
        return {
          bg: Colors.infoLight,
          text: Colors.info,
          border: '#BAE6FD',
          iconColor: Colors.info,
        };
      default:
        return {
          bg: Colors.surfaceMuted,
          text: Colors.textSecondary,
          border: Colors.border,
          iconColor: Colors.textSecondary,
        };
    }
  };

  const colors = getBadgeColors();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          paddingHorizontal: isSmall ? Spacing.sm : Spacing.md,
          paddingVertical: isSmall ? 3 : 5,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={isSmall ? 12 : 14}
          color={colors.iconColor}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.label,
          {
            color: colors.text,
            fontSize: isSmall ? Typography.sizes.xs : Typography.sizes.sm,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: Radii.pill,
    borderWidth: 1,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontWeight: Typography.weights.semibold,
  },
});
