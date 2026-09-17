// KRUSHI-SOOTRA (कृषी-सूत्र)
// Apple HIG 6-Tab Farmer Ergonomic Bottom Navigation Bar

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing, Typography } from '../constants/theme';

export const TABS = [
  { id: 'home', labelMr: 'मुख्य', labelEn: 'Home', icon: 'home', outlineIcon: 'home-outline' },
  { id: 'equipment', labelMr: 'अवजारे', labelEn: 'Equipment', icon: 'construct', outlineIcon: 'construct-outline' },
  { id: 'labour', labelMr: 'मजूर', labelEn: 'Labour', icon: 'people', outlineIcon: 'people-outline' },
  { id: 'storage', labelMr: 'गोदाम', labelEn: 'Storage', icon: 'business', outlineIcon: 'business-outline' },
  { id: 'lab', labelMr: 'लॅब व AI', labelEn: 'Lab & AI', icon: 'flask', outlineIcon: 'flask-outline', badge: 'AI' },
  { id: 'profile', labelMr: 'खाते', labelEn: 'Profile', icon: 'person', outlineIcon: 'person-outline' },
];

export default function AppBottomNav({
  activeTab = 'home',
  onSelectTab,
  language = 'mr',
}) {
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const label = language === 'mr' ? tab.labelMr : tab.labelEn;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onSelectTab && onSelectTab(tab.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                <Ionicons
                  name={isActive ? tab.icon : tab.outlineIcon}
                  size={22}
                  color={isActive ? Colors.primary : Colors.textSecondary}
                />
                {tab.badge && !isActive && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.activeTabLabel : styles.inactiveTabLabel,
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>

              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    ...Shadows.card,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 36,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIconWrapper: {
    backgroundColor: Colors.mintTint,
    borderRadius: Radii.lg,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 2,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: Radii.pill,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: Typography.weights.heavy,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  inactiveTabLabel: {
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 2,
  },
});
