// KRUSHI-SOOTRA (कृषी-सूत्र)
// Live Weather & Farmer Agro-Advisory Widget (Apple HIG Inset Grouped Design)

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors, Radii, Shadows, Spacing, Typography } from '../constants/theme';
import { fetchLiveWeatherData } from '../services/weatherApi';
import GlassPressable from './ui/GlassPressable';

const WEATHER_LABELS = {
  mr: {
    loading: 'हवामान माहिती मिळवत आहे...',
    offline: 'ऑफलाईन',
    feelsLike: 'जाणवणारे तापमान: ',
    rain: 'पाऊस',
    wind: 'वारा',
    humidity: 'आर्द्रता',
    defaultCondition: 'निरभ्र',
  },
  hi: {
    loading: 'मौसम की जानकारी प्राप्त हो रही है...',
    offline: 'ऑफ़लाइन',
    feelsLike: 'महसूस तापमान: ',
    rain: 'बारिश',
    wind: 'हवा',
    humidity: 'नमी',
    defaultCondition: 'साफ़',
  },
  en: {
    loading: 'Fetching live weather...',
    offline: 'Offline',
    feelsLike: 'Feels like: ',
    rain: 'Rain',
    wind: 'Wind',
    humidity: 'Humidity',
    defaultCondition: 'Clear',
  },
};

export default function WeatherCard({
  latitude = 18.5204,
  longitude = 73.8567,
  locationName = 'पुणे (हवेली)',
  language = 'mr',
  onRefresh,
}) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = WEATHER_LABELS[language] || WEATHER_LABELS.mr;

  const loadWeather = async () => {
    setLoading(true);
    try {
      const data = await fetchLiveWeatherData(latitude, longitude, language);
      setWeather(data);
    } catch (err) {
      console.warn('Error loading weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [latitude, longitude, language]);

  const handleRefresh = () => {
    loadWeather();
    if (onRefresh) onRefresh();
  };

  if (loading && !weather) {
    return (
      <View style={[styles.card, styles.loadingCard]}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingText}>{t.loading}</Text>
      </View>
    );
  }

  const current = weather?.current;
  const advisory = weather?.advisory;

  const getAdvisoryTheme = (type) => {
    switch (type) {
      case 'warning':
        return {
          bg: '#FEF3C7',
          border: '#F59E0B',
          text: '#92400E',
          icon: 'warning',
          iconColor: '#D97706',
        };
      case 'caution':
        return {
          bg: '#FFEDD5',
          border: '#F97316',
          text: '#9A3412',
          icon: 'alert-circle',
          iconColor: '#EA580C',
        };
      case 'success':
      default:
        return {
          bg: Colors.mintTint,
          border: Colors.mintBorder,
          text: Colors.primaryDark,
          icon: 'shield-checkmark',
          iconColor: Colors.primaryLight,
        };
    }
  };

  const advTheme = getAdvisoryTheme(advisory?.alertType);

  return (
    <View style={styles.card}>
      {/* Header Row: Location & Refresh */}
      <View style={styles.headerRow}>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color={Colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {typeof locationName === 'object'
              ? locationName[language] || locationName.mr || locationName.en
              : locationName}
          </Text>
          {weather?.isFallback && (
            <View style={styles.offlineChip}>
              <Text style={styles.offlineChipText}>{t.offline}</Text>
            </View>
          )}
        </View>
        <GlassPressable
          onPress={handleRefresh}
          style={styles.refreshButton}
          hapticType="light"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="refresh"
            size={18}
            color={loading ? Colors.textTertiary : Colors.primary}
          />
        </GlassPressable>
      </View>

      {/* Main Temp & Condition Row */}
      <View style={styles.tempRow}>
        <View style={styles.tempGroup}>
          <Text style={styles.temperature}>{current?.temperature ?? '--'}°</Text>
          <View style={styles.tempDetails}>
            <Text style={styles.conditionText} numberOfLines={1}>
              {current?.conditionName ?? t.defaultCondition}
            </Text>
            <Text style={styles.feelsLikeText} numberOfLines={1}>
              {t.feelsLike}
              {current?.apparentTemperature ?? '--'}°C
            </Text>
          </View>
        </View>

        <View style={styles.weatherIconBubble}>
          <Ionicons
            name={current?.icon || 'sunny'}
            size={32}
            color={Colors.primary}
          />
        </View>
      </View>

      {/* Weather Metrics Bar */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Ionicons name="water-outline" size={16} color={Colors.info} />
          <Text style={styles.metricLabel} numberOfLines={1}>{t.rain}</Text>
          <Text style={styles.metricValue} numberOfLines={1}>
            {advisory?.rainProb ?? 0}%
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Ionicons name="speedometer-outline" size={16} color={Colors.primaryLight} />
          <Text style={styles.metricLabel} numberOfLines={1}>{t.wind}</Text>
          <Text style={styles.metricValue} numberOfLines={1}>
            {current?.windSpeed ?? 0} km/h
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Ionicons name="cloud-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.metricLabel} numberOfLines={1}>{t.humidity}</Text>
          <Text style={styles.metricValue} numberOfLines={1}>
            {current?.humidity ?? 0}%
          </Text>
        </View>
      </View>

      {/* Agro-Advisory Banner */}
      {advisory && (
        <View
          style={[
            styles.advisoryBanner,
            {
              backgroundColor: advTheme.bg,
              borderColor: advTheme.border,
            },
          ]}
        >
          <View style={styles.advisoryHeader}>
            <Ionicons
              name={advTheme.icon}
              size={18}
              color={advTheme.iconColor}
              style={{ marginRight: Spacing.xs }}
            />
            <Text style={[styles.advisoryTitle, { color: advTheme.text }]} numberOfLines={1}>
              {advisory.title}
            </Text>
          </View>
          <Text style={[styles.advisoryMessage, { color: advTheme.text }]}>
            {advisory.message}
          </Text>
        </View>
      )}
    </View>
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
  loadingCard: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  locationText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginLeft: 4,
    flexShrink: 1,
  },
  offlineChip: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.sm,
    marginLeft: Spacing.sm,
    flexShrink: 0,
  },
  offlineChipText: {
    fontSize: 10,
    color: Colors.warning,
    fontWeight: Typography.weights.bold,
  },
  refreshButton: {
    padding: 7,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  tempRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  tempGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  temperature: {
    fontSize: 38,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  tempDetails: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  conditionText: {
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  feelsLikeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  weatherIconBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.mintTint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.mintBorder,
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: '70%',
    backgroundColor: Colors.border,
    alignSelf: 'center',
  },
  advisoryBanner: {
    borderRadius: Radii.lg,
    padding: 12,
    borderWidth: 1.5,
  },
  advisoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  advisoryTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    flex: 1,
  },
  advisoryMessage: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: Typography.weights.medium,
  },
});
