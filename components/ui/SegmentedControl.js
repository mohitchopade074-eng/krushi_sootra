// KRUSHI-SOOTRA (कृषी-सूत्र)
// Telegram & iOS Style Animated Sliding Capsule Glass Segmented Control

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Colors, Radii, Shadows, Spacing, Typography } from '../../constants/theme';
import { triggerHaptic } from '../../services/hapticsService';

export default function SegmentedControl({
  segments = [],
  selectedIndex = 0,
  onChange,
  style,
}) {
  const animatedIndex = useRef(new Animated.Value(selectedIndex)).current;

  useEffect(() => {
    Animated.spring(animatedIndex, {
      toValue: selectedIndex,
      useNativeDriver: false,
      tension: 260,
      friction: 20,
    }).start();
  }, [selectedIndex]);

  const handleSelect = (idx, segment) => {
    triggerHaptic('selection');
    if (onChange) onChange(idx, segment);
  };

  const count = segments.length || 1;
  const pillWidthPercent = 100 / count;

  const leftInterpolation = animatedIndex.interpolate({
    inputRange: segments.map((_, i) => i),
    outputRange: segments.map((_, i) => `${i * pillWidthPercent}%`),
  });

  return (
    <View style={[styles.track, style]}>
      {/* Animated Sliding Floating Glass Pill */}
      <Animated.View
        style={[
          styles.slidingPill,
          {
            width: `${pillWidthPercent}%`,
            left: leftInterpolation,
          },
        ]}
      />

      {/* Segment Items */}
      {segments.map((segment, index) => {
        const isSelected = selectedIndex === index;
        return (
          <Pressable
            key={segment.key || segment.id || index}
            style={styles.segmentButton}
            onPress={() => handleSelect(index, segment)}
          >
            <Text
              style={[
                styles.segmentText,
                isSelected && styles.selectedSegmentText,
              ]}
              numberOfLines={1}
            >
              {segment.label || segment}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: 'rgba(226, 232, 240, 0.65)',
    borderRadius: Radii.pill,
    padding: 3,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    position: 'relative',
    height: 44,
    alignItems: 'center',
  },
  slidingPill: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    backgroundColor: Colors.surface,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    ...Shadows.card,
    elevation: 3,
  },
  segmentButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  segmentText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
  },
  selectedSegmentText: {
    color: Colors.textPrimary,
    fontWeight: Typography.weights.bold,
  },
});
