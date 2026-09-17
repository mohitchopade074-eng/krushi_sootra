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
          <Text style={styles.locationText}>
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
            <Text style={styles.conditionText}>
              {current?.conditionName ?? t.defaultCondition}
            </Text>
            <Text style={styles.feelsLikeText}>
              {t.feelsLike}
              {current?.apparentTemperature ?? '--'}°C
            </Text>
          </View>
        </View>

        <View style={styles.weatherIconBubble}>
          <Ionicons
            name={current?.icon || 'sunny'}
            size={40}
            color={Colors.primary}
          />
        </View>
      </View>

      {/* Weather Metrics Bar */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Ionicons name="water-outline" size={16} color={Colors.info} />
          <Text style={styles.metricLabel}>{t.rain}</Text>
          <Text style={styles.metricValue}>
            {advisory?.rainProb ?? 0}%
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Ionicons name="speedometer-outline" size={16} color={Colors.primaryLight} />
          <Text style={styles.metricLabel}>{t.wind}</Text>
          <Text style={styles.metricValue}>
            {current?.windSpeed ?? 0} km/h
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Ionicons name="cloud-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.metricLabel}>{t.humidity}</Text>
          <Text style={styles.metricValue}>
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
            <Text style={[styles.advisoryTitle, { color: advTheme.text }]}>
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
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  loadingCard: {
    paddingVertical: Spacing.xxl,
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
    marginBottom: Spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginLeft: 4,
  },
  offlineChip: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.sm,
    marginLeft: Spacing.sm,
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
  },
  temperature: {
    fontSize: 48,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  tempDetails: {
    marginLeft: Spacing.md,
  },
  conditionText: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  feelsLikeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  weatherIconBubble: {
    width: 64,
    height: 64,
    borderRadius: Radii.xl,
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
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metricValue: {
    fontSize: Typography.sizes.body,
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
    padding: Spacing.md,
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
  },
  advisoryMessage: {
    fontSize: Typography.sizes.sm,
    lineHeight: 19,
    fontWeight: Typography.weights.medium,
  },
});
