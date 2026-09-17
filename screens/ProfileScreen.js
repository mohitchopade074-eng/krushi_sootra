// KRUSHI-SOOTRA (कृषी-सूत्र / कृषि-सूत्र)
// Profile & Multi-Role Switching Screen (100% Pure Isolated Multilingual)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing, Typography } from '../constants/theme';
import { BRANDING, ROLES_DATA, UI_STRINGS } from '../constants/branding';
import SegmentedControl from '../components/ui/SegmentedControl';
import StatusBadge from '../components/ui/StatusBadge';
import GlassCard from '../components/ui/GlassCard';
import GlassPressable from '../components/ui/GlassPressable';

const PROFILE_TEXTS = {
  mr: {
    userName: 'शरद पवार शेतकरी गट',
    location: '📍 हवेली, जिल्हा: पुणे, महाराष्ट्र',
    roleChangedTitle: 'भूमिका बदलली!',
    activeRoleMsg: 'सध्याची सक्रिय भूमिका:',
    confirmedStatus: 'निश्चित',
    allTab: 'सर्व',
    activeTab: 'सक्रिय',
    completedTab: 'पूर्ण',
  },
  hi: {
    userName: 'शरद पवार किसान समूह',
    location: '📍 हवेली, जिला: पुणे, महाराष्ट्र',
    roleChangedTitle: 'भूमिका बदली गई!',
    activeRoleMsg: 'वर्तमान सक्रिय भूमिका:',
    confirmedStatus: 'पक्की',
    allTab: 'सभी',
    activeTab: 'सक्रिय',
    completedTab: 'पूर्ण',
  },
  en: {
    userName: 'Sharad Pawar Farmers Club',
    location: '📍 Haveli, District: Pune, Maharashtra',
    roleChangedTitle: 'Role Updated!',
    activeRoleMsg: 'Current Active Role:',
    confirmedStatus: 'Confirmed',
    allTab: 'All',
    activeTab: 'Active',
    completedTab: 'Done',
  },
};

export default function ProfileScreen({
  currentRole = 'farmer',
  onRoleChange,
  currentLanguage = 'mr',
  onLanguageChange,
  bookings = [],
}) {
  const [activeBookingSegment, setActiveBookingSegment] = useState(0);

  const t = PROFILE_TEXTS[currentLanguage] || PROFILE_TEXTS.mr;
  const brand = BRANDING[currentLanguage] || BRANDING.mr;
  const ui = UI_STRINGS[currentLanguage] || UI_STRINGS.mr;
  const rolesList = Object.values(ROLES_DATA);

  const filterBookings = () => {
    if (activeBookingSegment === 1) {
      return bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending');
    }
    if (activeBookingSegment === 2) {
      return bookings.filter((b) => b.status === 'Completed');
    }
    return bookings;
  };

  const displayedBookings = filterBookings();

  const handleCallHelpline = () => {
    Linking.openURL('tel:18001801551').catch(() => {
      Alert.alert(ui.helplineTitle, ui.helplineNumber);
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Glass Header */}
      <GlassCard intensity={45} style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={Colors.primary} />
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.farmerName} numberOfLines={1}>{t.userName}</Text>
          <Text style={styles.phoneText} numberOfLines={1}>+91 98220 76543</Text>
          <Text style={styles.villageText} numberOfLines={1}>{t.location}</Text>
        </View>
      </GlassCard>

      {/* Role Switcher Glass Section */}
      <GlassCard intensity={30} style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionIconBadge}>
            <Ionicons name="swap-horizontal" size={18} color={Colors.primary} />
          </View>
          <Text style={styles.sectionTitle}>{ui.switchRole}</Text>
        </View>
        <Text style={styles.sectionSubtitle}>{ui.switchRoleSub}</Text>

        <View style={styles.rolesList}>
          {rolesList.map((r) => {
            const isSelected = currentRole === r.id;
            const rName = r.name[currentLanguage] || r.name.mr;
            const rDesc = r.desc[currentLanguage] || r.desc.mr;

            return (
              <GlassPressable
                key={r.id}
                hapticType="selection"
                scaleTo={0.97}
                style={[styles.roleItem, isSelected && styles.roleItemActive]}
                onPress={() => {
                  if (onRoleChange) onRoleChange(r.id);
                  Alert.alert(t.roleChangedTitle, `${t.activeRoleMsg} ${rName}`);
                }}
              >
                <View style={styles.roleItemLeft}>
                  <View style={styles.roleIconCircle}>
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                      size={20}
                      color={isSelected ? Colors.primary : Colors.textTertiary}
                    />
                  </View>
                  <View style={styles.roleTextContainer}>
                    <Text style={[styles.roleName, isSelected && styles.roleNameActive]} numberOfLines={1}>
                      {rName}
                    </Text>
                    <Text style={styles.roleDesc} numberOfLines={2}>{rDesc}</Text>
                  </View>
                </View>
              </GlassPressable>
            );
          })}
        </View>
      </GlassCard>

      {/* Universal Booking Tracker Glass Section */}
      <GlassCard intensity={30} style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionIconBadge}>
            <Ionicons name="calendar" size={18} color={Colors.primary} />
          </View>
          <Text style={styles.sectionTitle}>{ui.myBookings}</Text>
        </View>

        <View style={styles.segmentedWrapper}>
          <SegmentedControl
            segments={[
              { label: `${t.allTab} (${bookings.length})` },
              { label: t.activeTab },
              { label: t.completedTab },
            ]}
            selectedIndex={activeBookingSegment}
            onChange={(idx) => setActiveBookingSegment(idx)}
          />
        </View>

        {displayedBookings.length === 0 ? (
          <View style={styles.emptyBookings}>
            <Ionicons name="receipt-outline" size={36} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>{ui.noBookings}</Text>
            <Text style={styles.emptySubText}>{ui.noBookingsSub}</Text>
          </View>
        ) : (
          displayedBookings.map((b) => (
            <View key={b.id} style={styles.bookingCard}>
              <View style={styles.bookingTopRow}>
                <Text style={styles.bookingId}>{b.id}</Text>
                <StatusBadge
                  label={b.status === 'Confirmed' ? t.confirmedStatus : b.status}
                  status="success"
                  size="small"
                />
              </View>
              <Text style={styles.bookingResource}>{b.resourceName}</Text>
              <View style={styles.bookingMetaRow}>
                <Text style={styles.bookingDate}>📅 {b.date}</Text>
                <Text style={styles.bookingAmount}>₹{b.totalAmount}</Text>
              </View>
            </View>
          ))
        )}
      </GlassCard>

      {/* Language Selector Glass Section */}
      <GlassCard intensity={30} style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionIconBadge}>
            <Ionicons name="language" size={18} color={Colors.primary} />
          </View>
          <Text style={styles.sectionTitle}>{ui.selectLanguage}</Text>
        </View>

        <View style={styles.langRow}>
          {[
            { id: 'mr', label: 'मराठी' },
            { id: 'hi', label: 'हिंदी' },
            { id: 'en', label: 'English' },
          ].map((l) => {
            const isSelected = currentLanguage === l.id;
            return (
              <GlassPressable
                key={l.id}
                hapticType="selection"
                scaleTo={0.96}
                style={[styles.langBtn, isSelected && styles.langBtnActive]}
                onPress={() => onLanguageChange && onLanguageChange(l.id)}
              >
                <Text style={[styles.langBtnText, isSelected && styles.langBtnTextActive]}>
                  {l.label}
                </Text>
              </GlassPressable>
            );
          })}
        </View>
      </GlassCard>

      {/* Emergency Kisan Call Center Glass Card */}
      <GlassPressable
        hapticType="medium"
        scaleTo={0.97}
        style={styles.helplineCard}
        onPress={handleCallHelpline}
      >
        <View style={styles.helplineIcon}>
          <Ionicons name="call" size={22} color="#DC2626" />
        </View>
        <View style={styles.helplineText}>
          <Text style={styles.helplineTitle}>{ui.helplineTitle}</Text>
          <Text style={styles.helplinePhone}>{ui.helplineNumber}</Text>
          <Text style={styles.helplineSub}>{ui.helplineSub}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#DC2626" />
      </GlassPressable>

      {/* Version Footer */}
      <View style={styles.versionFooter}>
        <Text style={styles.versionText}>{brand.appName} v1.0.0</Text>
        <Text style={styles.versionSub}>{brand.copyright}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: 110, // Floating dock clearance
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radii.xxl,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.mintTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.mintBorder,
  },
  profileDetails: {
    flex: 1,
  },
  farmerName: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  phoneText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
    marginTop: 2,
  },
  villageText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    borderRadius: Radii.xxl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.mintTint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.mintBorder,
  },
  sectionTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 16,
  },
  rolesList: {
    marginTop: Spacing.xs,
  },
  roleItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: Colors.glassSurfaceElevated,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  roleItemActive: {
    backgroundColor: Colors.mintTint,
    borderColor: Colors.primary,
  },
  roleItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIconCircle: {
    marginRight: Spacing.md,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  roleNameActive: {
    color: Colors.primary,
  },
  roleDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  segmentedWrapper: {
    marginBottom: Spacing.md,
  },
  emptyBookings: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  emptySubText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 2,
  },
  bookingCard: {
    backgroundColor: Colors.glassSurfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  bookingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookingId: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  bookingResource: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  bookingMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  bookingAmount: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.heavy,
    color: Colors.primary,
  },
  langRow: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.lg,
    backgroundColor: Colors.glassSurfaceElevated,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginHorizontal: 4,
  },
  langBtnActive: {
    backgroundColor: Colors.mintTint,
    borderColor: Colors.primary,
  },
  langBtnText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  langBtnTextActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  helplineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(254, 242, 242, 0.9)',
    borderRadius: Radii.xxl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    marginBottom: Spacing.xl,
    ...Shadows.subtle,
  },
  helplineIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  helplineText: {
    flex: 1,
  },
  helplineTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: '#991B1B',
  },
  helplinePhone: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.heavy,
    color: '#DC2626',
    marginTop: 2,
  },
  helplineSub: {
    fontSize: 10,
    color: '#B91C1C',
    marginTop: 2,
  },
  versionFooter: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  versionText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  versionSub: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },
});
