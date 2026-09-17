// KRUSHI-SOOTRA (कृषी-सूत्र)
// Floating Frosted Glass Bottom Navigation Bar with Spring Physics & Haptics

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors, Radii, Shadows, Spacing, Typography } from '../constants/theme';
import { NAV_TABS } from '../constants/branding';
import { triggerHaptic } from '../services/hapticsService';

function NavTabItem({ tab, isActive, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.16, duration: 120, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 14, tension: 240, useNativeDriver: true }),
      ]).start();
    }
  }, [isActive]);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, tension: 300, friction: 20 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 240, friction: 18 }).start();
  };

  return (
    <Pressable
      style={styles.tabButton}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.iconWrapper,
          isActive && styles.activeIconWrapper,
          { transform: [{ scale }] },
        ]}
      >
        <Ionicons
          name={isActive ? tab.icon : tab.outlineIcon}
          size={21}
          color={isActive ? Colors.primaryDark : Colors.textSecondary}
        />
        {tab.badge && !isActive && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{tab.badge}</Text>
          </View>
        )}
      </Animated.View>

      <Text
        style={[
          styles.tabLabel,
          isActive ? styles.activeTabLabel : styles.inactiveTabLabel,
        ]}
        numberOfLines={1}
      >
        {tab.label}
      </Text>

      {isActive && <View style={styles.activePillGlow} />}
    </Pressable>
  );
}

export default function AppBottomNav({
  activeTab = 'home',
  onSelectTab,
  language = 'mr',
}) {
  const currentTabs = NAV_TABS[language] || NAV_TABS.mr;

  const handleSelect = (tabId) => {
    triggerHaptic('selection');
    if (onSelectTab) onSelectTab(tabId);
  };

  const navContent = (
    <View style={styles.navBar}>
      {currentTabs.map((tab) => (
        <NavTabItem
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          onPress={() => handleSelect(tab.id)}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <View style={styles.floatingDock}>
        {Platform.OS !== 'web' ? (
          <BlurView intensity={75} tint="light" style={styles.blurWrapper}>
            {navContent}
          </BlurView>
        ) : (
          <View style={styles.webWrapper}>
            {navContent}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 12,
    left: 12,
    right: 12,
    alignItems: 'center',
    zIndex: 100,
  },
  floatingDock: {
    width: '100%',
    borderRadius: Radii.xxl,
    overflow: 'hidden',
    backgroundColor: Colors.glassSurfaceElevated,
    borderWidth: 1.2,
    borderColor: Colors.glassBorder,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  blurWrapper: {
    width: '100%',
  },
  webWrapper: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    backdropFilter: 'blur(20px)',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
    position: 'relative',
  },
  iconWrapper: {
    width: 38,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: Radii.pill,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(16, 185, 129, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.28)',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 2,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: Radii.sm,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: Typography.weights.medium,
  },
  activeTabLabel: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
  inactiveTabLabel: {
    color: Colors.textSecondary,
  },
  activePillGlow: {
    position: 'absolute',
    bottom: -4,
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});
