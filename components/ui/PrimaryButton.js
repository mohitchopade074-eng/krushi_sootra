// KRUSHI-SOOTRA (कृषी-सूत्र)
// Farmer-Ergonomic Prominent Action Button (Apple HIG - 56px Touch Target)

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing, Typography } from '../../constants/theme';

export default function PrimaryButton({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'mint' | 'danger'
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
  const isMint = variant === 'mint';
  const isDanger = variant === 'danger';

  const getHeight = () => {
    if (size === 'large') return 56;
    if (size === 'medium') return 46;
    return 38;
  };

  const getBackgroundColor = () => {
    if (disabled) return Colors.surfaceMuted;
    if (isPrimary) return Colors.primary;
    if (isSecondary) return Colors.primaryLight;
    if (isMint) return Colors.mintTint;
    if (isDanger) return Colors.error;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return Colors.textTertiary;
    if (isPrimary || isSecondary || isDanger) return Colors.textInverse;
    if (isMint) return Colors.primary;
    return Colors.primary;
  };

  const textColor = getTextColor();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          height: getHeight(),
          backgroundColor: getBackgroundColor(),
          borderColor: isOutline ? Colors.primary : isMint ? Colors.mintBorder : 'transparent',
          borderWidth: isOutline || isMint ? 1.5 : 0,
        },
        isPrimary && !disabled ? Shadows.prominent : Shadows.subtle,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.82}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 18 : 22}
              color={textColor}
              style={styles.leftIcon}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                color: textColor,
                fontSize: size === 'small' ? Typography.sizes.sm : Typography.sizes.body,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 18 : 22}
              color={textColor}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radii.xl,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
});
