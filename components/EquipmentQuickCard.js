// KRUSHI-SOOTRA (कृषी-सूत्र)
// Equipment Discovery Card with Haversine Distance Badge & Apple HIG Ergonomics

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing, Typography } from '../constants/theme';
import StatusBadge from './ui/StatusBadge';
import { formatDistance } from '../services/locationService';

export default function EquipmentQuickCard({
  item,
  language = 'mr',
  onPress,
  onBook,
}) {
  const isAvailable = item.status === 'Available';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={item.category === 'Tractor' ? 'hardware-chip-outline' : 'construct-outline'}
            size={24}
            color={Colors.primary}
          />
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {typeof item.name === 'object'
                ? item.name[language] || item.name.mr || item.name.en
                : item.name}
            </Text>
          </View>
          <Text style={styles.modelSubtitle} numberOfLines={1}>
            {item.brand} • {item.model}
          </Text>
        </View>

        <StatusBadge
          label={
            isAvailable
              ? (language === 'hi' ? 'उपलब्ध' : language === 'en' ? 'Available' : 'उपलब्ध')
              : (language === 'hi' ? 'व्यस्त' : language === 'en' ? 'In Use' : 'व्यस्त')
          }
          status={isAvailable ? 'success' : 'warning'}
          size="small"
        />
      </View>

      <View style={styles.divider} />

      {/* Meta Information: Distance, Rating, Location */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="navigate-outline" size={14} color={Colors.primaryLight} />
          <Text style={styles.distanceText}>
            {formatDistance(item.distanceKm, language)}
          </Text>
        </View>

        <View style={styles.metaDot} />

        <View style={styles.metaItem}>
          <Ionicons name="star" size={14} color={Colors.warning} />
          <Text style={styles.ratingText}>
            {item.rating || '4.8'} ({item.reviewCount || 12})
          </Text>
        </View>

        <View style={styles.metaDot} />

        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {typeof item.village === 'object'
              ? item.village[language] || item.village.mr || item.village.en
              : (item.village || (language === 'en' ? 'Pune' : 'पुणे'))}
          </Text>
        </View>
      </View>

      {/* Pricing and Action Footer */}
      <View style={styles.footerRow}>
        <View>
          <Text style={styles.priceLabel}>
            {language === 'hi' ? 'किराया दर' : language === 'en' ? 'Rental Rate' : 'भाडे दर'}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceValue}>₹{item.dailyPrice}</Text>
            <Text style={styles.priceUnit}>
              {language === 'hi' ? '/दिन' : language === 'en' ? '/day' : '/दिवस'}
            </Text>
            {item.acrePrice && (
              <Text style={styles.subPrice}>
                (₹{item.acrePrice}{language === 'hi' ? '/एकड़' : language === 'en' ? '/acre' : '/एकर'})
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={onBook || onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>
            {language === 'hi' ? 'बुक करें' : language === 'en' ? 'Book Now' : 'बुक करा'}
          </Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.textInverse} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xxl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radii.xl,
    backgroundColor: Colors.mintTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  modelSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.borderDark,
    marginHorizontal: Spacing.sm,
  },
  distanceText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryLight,
    marginLeft: 4,
  },
  ratingText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginLeft: 4,
  },
  locationText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceValue: {
    fontSize: Typography.sizes.headline,
    fontWeight: Typography.weights.heavy,
    color: Colors.primary,
  },
  priceUnit: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  subPrice: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radii.xl,
    ...Shadows.subtle,
  },
  bookButtonText: {
    color: Colors.textInverse,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
  },
});
