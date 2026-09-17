import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing, Typography } from '../constants/theme';
import StatusBadge from './ui/StatusBadge';
import GlassPressable from './ui/GlassPressable';
import { formatDistance } from '../services/locationService';

export default function EquipmentQuickCard({
  item,
  language = 'mr',
  onPress,
  onBook,
}) {
  const isAvailable = item.status === 'Available';

  return (
    <GlassPressable
      style={styles.card}
      onPress={onPress}
      hapticType="light"
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
          <Ionicons name="navigate-outline" size={13} color={Colors.primaryLight} />
          <Text style={styles.distanceText}>
            {formatDistance(item.distanceKm, language)}
          </Text>
        </View>

        <View style={styles.metaDot} />

        <View style={styles.metaItem}>
          <Ionicons name="star" size={13} color={Colors.warning} />
          <Text style={styles.ratingText}>
            {item.rating || '4.8'} ({item.reviewCount || 12})
          </Text>
        </View>

        <View style={styles.metaDot} />

        <View style={[styles.metaItem, styles.metaLocation]}>
          <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {typeof item.village === 'object'
              ? item.village[language] || item.village.mr || item.village.en
              : (item.village || (language === 'en' ? 'Pune' : 'पुणे'))}
          </Text>
        </View>
      </View>

      {/* Pricing and Action Footer */}
      <View style={styles.footerRow}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>
            {language === 'hi' ? 'किराया दर' : language === 'en' ? 'Rental Rate' : 'भाडे दर'}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceValue}>₹{item.dailyPrice}</Text>
            <Text style={styles.priceUnit}>
              {language === 'hi' ? '/दिन' : language === 'en' ? '/day' : '/दिवस'}
            </Text>
            {item.acrePrice && (
              <Text style={styles.subPrice} numberOfLines={1}>
                (₹{item.acrePrice}{language === 'hi' ? '/एकड़' : language === 'en' ? '/acre' : '/एकर'})
              </Text>
            )}
          </View>
        </View>

        <GlassPressable
          style={styles.bookButton}
          onPress={onBook || onPress}
          hapticType="medium"
        >
          <Text style={styles.bookButtonText}>
            {language === 'hi' ? 'बुक करें' : language === 'en' ? 'Book Now' : 'बुक करा'}
          </Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.textInverse} style={{ marginLeft: 4 }} />
        </GlassPressable>
      </View>
    </GlassPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: Radii.xxl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: Radii.xl,
    backgroundColor: Colors.mintTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
    marginRight: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  modelSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLocation: {
    flex: 1,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.borderDark,
    marginHorizontal: 6,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryLight,
    marginLeft: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginLeft: 3,
  },
  locationText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 3,
    flexShrink: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  priceLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'nowrap',
  },
  priceValue: {
    fontSize: 19,
    fontWeight: Typography.weights.heavy,
    color: Colors.primary,
  },
  priceUnit: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  subPrice: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginLeft: 4,
    flexShrink: 1,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radii.lg,
    ...Shadows.subtle,
  },
  bookButtonText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: Typography.weights.bold,
  },
});
