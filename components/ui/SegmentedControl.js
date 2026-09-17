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

  const inputRange = segments.length > 1 ? segments.map((_, i) => i) : [0, 1];
  const outputRange =
    segments.length > 1
      ? segments.map((_, i) => `${i * pillWidthPercent}%`)
      : ['0%', '100%'];

  const leftInterpolation = animatedIndex.interpolate({
    inputRange,
    outputRange,
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
              ellipsizeMode="tail"
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
    backgroundColor: 'rgba(226, 232, 240, 0.7)',
    borderRadius: Radii.pill,
    padding: 2.5,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    position: 'relative',
    height: 42,
    alignItems: 'center',
  },
  slidingPill: {
    position: 'absolute',
    top: 2.5,
    bottom: 2.5,
    backgroundColor: Colors.surface,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    ...Shadows.card,
    elevation: 3,
  },
  segmentButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    paddingHorizontal: 4,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
  },
  selectedSegmentText: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
});
