// KRUSHI-SOOTRA (कृषी-सूत्र)
// Apple HIG Segmented Control for Category/Status Toggles

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Radii, Shadows, Spacing, Typography } from '../../constants/theme';

export default function SegmentedControl({
  segments = [],
  selectedIndex = 0,
  onChange,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {segments.map((segment, index) => {
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            key={segment.key || segment.id || index}
            style={[
              styles.segment,
              isSelected && styles.selectedSegment,
            ]}
            onPress={() => onChange && onChange(index, segment)}
            activeOpacity={0.8}
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
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: Radii.lg,
    padding: 3,
    marginBottom: Spacing.md,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.md,
  },
  selectedSegment: {
    backgroundColor: Colors.surface,
    ...Shadows.subtle,
  },
  segmentText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
  },
  selectedSegmentText: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
});
