// KRUSHI-SOOTRA (कृषी-सूत्र)
// Physics-based Glass Pressable Component with Native UI Thread Spring & Haptics

import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { triggerHaptic } from '../../services/hapticsService';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GlassPressable({
  children,
  onPress,
  onLongPress,
  style,
  activeScale = 0.965,
  hapticType = 'light',
  disabled = false,
  ...rest
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    if (hapticType) triggerHaptic(hapticType);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: activeScale,
        useNativeDriver: true,
        tension: 320,
        friction: 20,
      }),
      Animated.timing(opacity, {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 260,
        friction: 18,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        style,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
