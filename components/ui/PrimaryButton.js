// KRUSHI-SOOTRA (कृषी-सूत्र)
// Physics-Driven Glass Action Button with Native Haptic Pulses

import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing, Typography } from '../../constants/theme';
import GlassPressable from './GlassPressable';

export default function PrimaryButton({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'glass' | 'danger'
  size = 'large',     // 'large' (56px) | 'medium' (46px) | 'small' (38px)
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isGlass = variant === 'glass' || variant === 'mint';
  const isDanger = variant === 'danger';

  const getHeight = () => {
    if (size === 'large') return 54;
    if (size === 'medium') return 44;
    return 36;
  };

  const getBackgroundColor = () => {
    if (disabled) return 'rgba(226, 232, 240, 0.6)';
    if (isPrimary) return Colors.primary;
    if (isSecondary) return Colors.primaryDark;
    if (isGlass) return 'rgba(16, 185, 129, 0.12)';
    if (isDanger) return Colors.error;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return Colors.textTertiary;
    if (isPrimary || isSecondary || isDanger) return Colors.textInverse;
    if (isGlass) return Colors.primary;
    return Colors.primary;
  };

  const textColor = getTextColor();

  return (
    <GlassPressable
      onPress={onPress}
      disabled={disabled || loading}
      hapticType="medium"
      style={[
        styles.buttonBase,
        {
          height: getHeight(),
          backgroundColor: getBackgroundColor(),
          borderWidth: isOutline ? 1.5 : (isGlass ? 1 : 0),
          borderColor: isOutline ? Colors.primary : (isGlass ? Colors.mintBorder : 'transparent'),
        },
        isPrimary && !disabled && styles.buttonGlow,
        style,
      ]}
      {...props}
    >
      <View style={styles.contentRow}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={textColor}
            style={styles.loadingSpinner}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={size === 'small' ? 16 : 20}
                color={textColor}
                style={styles.iconLeft}
              />
            )}

            <Text
              style={[
                styles.buttonText,
                {
                  color: textColor,
                  fontSize: size === 'small' ? Typography.sizes.xs : Typography.sizes.body,
                },
                textStyle,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>

            {icon && iconPosition === 'right' && (
              <Ionicons
                name={icon}
                size={size === 'small' ? 16 : 20}
                color={textColor}
                style={styles.iconRight}
              />
            )}
          </>
        )}
      </View>
    </GlassPressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: Radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    overflow: 'hidden',
  },
  buttonGlow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.2,
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  loadingSpinner: {
    marginVertical: 2,
  },
});
