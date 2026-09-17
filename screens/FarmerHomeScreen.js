// KRUSHI-SOOTRA (कृषी-सूत्र / कृषि-सूत्र)
// Farmer Home Dashboard Screen (100% Isolated Multilingual UI)

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  Radii,
  Shadows,
  Spacing,
  Typography,
} from '../constants/theme';
import {
  BRANDING,
  CORE_MODULES_DATA,
  ROLES_DATA,
  UI_STRINGS,
} from '../constants/branding';
import WeatherCard from '../components/WeatherCard';
import EquipmentQuickCard from '../components/EquipmentQuickCard';
import StatusBadge from '../components/ui/StatusBadge';
import GlassPressable from '../components/ui/GlassPressable';
import { filterByRadius, AGRICULTURAL_LOCATIONS, requestDeviceLocation } from '../services/locationService';

// Sample verified regional inventory with pure translations for each language
const MOCK_NEARBY_EQUIPMENT = [
  {
    id: 'eq_1',
    name: {
      mr: 'महिंद्रा ५७५ डीआय ट्रॅक्टर',
      hi: 'महिंद्रा ५७५ डीआई ट्रैक्टर',
      en: 'Mahindra 575 DI Tractor',
    },
    brand: 'Mahindra',
    model: '575 DI (45 HP)',
    category: 'Tractor',
    dailyPrice: 1800,
    acrePrice: 900,
    status: 'Available',
    latitude: 18.5300,
    longitude: 73.8700,
    village: { mr: 'हवेली, पुणे', hi: 'हवेली, पुणे', en: 'Haveli, Pune' },
    rating: 4.9,
    reviewCount: 38,
  },
  {
    id: 'eq_2',
    name: {
      mr: 'शक्तीमान रोटाव्हेटर (७ फूट)',
      hi: 'शक्तिमान रोटावेटर (७ फीट)',
      en: 'Shaktiman Rotavator (7 ft)',
    },
    brand: 'Shaktiman',
    model: 'Champion 7ft',
    category: 'Rotavator',
    dailyPrice: 1100,
    acrePrice: 550,
    status: 'Available',
    latitude: 18.5600,
    longitude: 73.8100,
    village: { mr: 'मांजरी, पुणे', hi: 'मांजरी, पुणे', en: 'Manjari, Pune' },
    rating: 4.8,
    reviewCount: 22,
  },
  {
    id: 'eq_3',
    name: {
      mr: 'हाय-टेक कृषी फवारणी ड्रोन',
      hi: 'हाई-टेक कृषि छिड़काव ड्रोन',
      en: 'Hi-Tech Agri Spraying Drone',
    },
    brand: 'IoTech',
    model: 'AgroBot 16L',
    category: 'Drone',
    dailyPrice: 3500,
    acrePrice: 400,
    status: 'Available',
    latitude: 18.4900,
    longitude: 73.9100,
    village: { mr: 'हडपसर, पुणे', hi: 'हड़पसर, पुणे', en: 'Hadapsar, Pune' },
    rating: 5.0,
    reviewCount: 16,
  },
  {
    id: 'eq_4',
    name: {
      mr: 'लेझर जमीन सपाटीकरण यंत्र',
      hi: 'लेजर भूमि समतलीकरण यंत्र',
      en: 'Laser Land Leveler Pro',
    },
    brand: 'Gahir',
    model: 'Level Pro',
    category: 'Leveler',
    dailyPrice: 2200,
    acrePrice: 1100,
    status: 'In Use',
    latitude: 18.6200,
    longitude: 73.7900,
    village: { mr: 'पिंपरी, पुणे', hi: 'पिंपरी, पुणे', en: 'Pimpri, Pune' },
    rating: 4.7,
    reviewCount: 19,
  },
];

export default function FarmerHomeScreen({
  language = 'mr',
  onLanguageChange,
  onNavigateTab,
  onBookEquipment,
}) {
  const [selectedLocation, setSelectedLocation] = useState(AGRICULTURAL_LOCATIONS.PUNE);

  const brand = BRANDING[language] || BRANDING.mr;
  const ui = UI_STRINGS[language] || UI_STRINGS.mr;
  const farmerRole = ROLES_DATA.farmer.name[language] || ROLES_DATA.farmer.name.mr;

  // Auto-request live device GPS on startup
  useEffect(() => {
    const fetchGPS = async () => {
      const res = await requestDeviceLocation();
      if (res.success && res.latitude && res.longitude) {
        setSelectedLocation({
          name: res.placeName,
          lat: res.latitude,
          lon: res.longitude,
        });
      }
    };
    fetchGPS();
  }, []);

  // Filter nearby equipment within 20 km radius using Haversine algorithm
  const nearbyItems = useMemo(() => {
    return filterByRadius(
      MOCK_NEARBY_EQUIPMENT,
      selectedLocation.lat,
      selectedLocation.lon,
      25
    );
  }, [selectedLocation]);

  const handleModulePress = (module) => {
    if (onNavigateTab) {
      if (module.id === 'equipment') onNavigateTab('equipment');
      else if (module.id === 'labour') onNavigateTab('labour');
      else if (module.id === 'warehouse') onNavigateTab('storage');
      else if (module.id === 'soil' || module.id === 'disease' || module.id === 'ai_assistant') {
        onNavigateTab('lab');
      }
    }
  };

  const handleBookEquipmentItem = (item) => {
    if (onNavigateTab) {
      onNavigateTab('equipment');
    } else if (onBookEquipment) {
      onBookEquipment(item);
    }
  };

  const toggleLanguage = () => {
    let next = 'mr';
    if (language === 'mr') next = 'hi';
    else if (language === 'hi') next = 'en';
    if (onLanguageChange) onLanguageChange(next);
  };

  const cycleLocation = async () => {
    const locKeys = Object.keys(AGRICULTURAL_LOCATIONS);
    const currentIndex = locKeys.findIndex(
      (k) => AGRICULTURAL_LOCATIONS[k].lat === selectedLocation.lat
    );
    const nextKey = locKeys[(currentIndex + 1) % locKeys.length];
    setSelectedLocation(AGRICULTURAL_LOCATIONS[nextKey]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Header & Branding Bar */}
        <View style={styles.topHeader}>
          <View style={styles.brandTitleGroup}>
            <Text style={styles.brandTitle} numberOfLines={1}>{brand.appName}</Text>
            <Text style={styles.brandTagline} numberOfLines={1}>{brand.tagline}</Text>
          </View>

          {/* Language Switcher Pill */}
          <GlassPressable
            style={styles.langPill}
            onPress={toggleLanguage}
            hapticType="selection"
          >
            <Ionicons name="globe-outline" size={15} color={Colors.primary} />
            <Text style={styles.langText}>
              {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'English'}
            </Text>
          </GlassPressable>
        </View>

        {/* Farmer Profile & Active Location Strip */}
        <View style={styles.profileStrip}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={20} color={Colors.primary} />
            </View>
            <View style={styles.greetingGroup}>
              <Text style={styles.greetingTitle} numberOfLines={1}>
                {brand.welcomeUser}
              </Text>
              <Text style={styles.userStatusText} numberOfLines={1}>
                {brand.userStatus}
              </Text>
              <GlassPressable
                style={styles.locationSelector}
                onPress={cycleLocation}
                hapticType="selection"
              >
                <Ionicons name="location" size={13} color={Colors.primaryLight} />
                <Text style={styles.locationSelectorText} numberOfLines={1}>
                  {typeof selectedLocation?.name === 'object'
                    ? selectedLocation.name[language] || selectedLocation.name.mr || selectedLocation.name.en
                    : selectedLocation?.name}
                </Text>
                <Text style={styles.locationChangeLink}>({ui.changeLocation})</Text>
              </GlassPressable>
            </View>
          </View>

          {/* Active Role Badge */}
          <StatusBadge
            label={farmerRole}
            status="success"
            icon="leaf"
            size="small"
          />
        </View>

        {/* AI Krushi Assistant High-Priority Quick-Bar */}
        <GlassPressable
          style={styles.aiQuickBar}
          onPress={() => onNavigateTab && onNavigateTab('lab')}
          hapticType="medium"
        >
          <View style={styles.aiIconBubble}>
            <Ionicons name="sparkles" size={18} color="#7C3AED" />
          </View>
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle} numberOfLines={1}>{ui.aiBannerTitle}</Text>
            <Text style={styles.aiSubtitle} numberOfLines={2}>
              {ui.aiBannerSub}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} style={{ marginLeft: 4 }} />
        </GlassPressable>

        {/* Live Weather & Agro-Advisory Widget (Open-Meteo Integration) */}
        <WeatherCard
          latitude={selectedLocation.lat}
          longitude={selectedLocation.lon}
          locationName={selectedLocation.name}
          language={language}
        />

        {/* 5 Core Platform Modules Grid */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{ui.coreServicesTitle}</Text>
          <Text style={styles.sectionSubtitle}>{ui.coreServicesSub}</Text>
        </View>

        <View style={styles.modulesGrid}>
          {CORE_MODULES_DATA.map((mod) => (
            <GlassPressable
              key={mod.id}
              style={styles.moduleCard}
              onPress={() => handleModulePress(mod)}
              hapticType="light"
            >
              <View
                style={[
                  styles.moduleIconBox,
                  { backgroundColor: `${mod.color}15` },
                ]}
              >
                <Ionicons name={mod.icon} size={26} color={mod.color} />
              </View>

              <View style={styles.moduleTextGroup}>
                <View style={styles.moduleTitleRow}>
                  <Text style={styles.moduleTitle} numberOfLines={1}>
                    {mod.title[language] || mod.title.mr}
                  </Text>
                </View>
                <Text style={styles.moduleSubtitle} numberOfLines={2}>
                  {mod.subtitle[language] || mod.subtitle.mr}
                </Text>
              </View>

              <View style={styles.moduleFooterRow}>
                <View style={[styles.moduleBadge, { borderColor: `${mod.color}40` }]}>
                  <Text style={[styles.moduleBadgeText, { color: mod.color }]}>
                    {mod.badge[language] || mod.badge.mr}
                  </Text>
                </View>
                <Ionicons name="arrow-forward-circle" size={22} color={mod.color} />
              </View>
            </GlassPressable>
          ))}
        </View>

        {/* Soil Health Scanner Special Banner */}
        <GlassPressable
          style={styles.soilBanner}
          onPress={() => onNavigateTab && onNavigateTab('lab')}
          hapticType="medium"
        >
          <View style={styles.soilBannerContent}>
            <View style={styles.soilIconBox}>
              <Ionicons name="document-text" size={26} color="#B45309" />
            </View>
            <View style={styles.soilTextGroup}>
              <Text style={styles.soilBannerTitle}>
                {ui.soilBannerTitle}
              </Text>
              <Text style={styles.soilBannerDesc}>
                {ui.soilBannerDesc}
              </Text>
            </View>
          </View>
          <View style={styles.soilBannerAction}>
            <Text style={styles.soilActionText}>{ui.scanAction}</Text>
            <Ionicons name="camera" size={16} color={Colors.primary} style={{ marginLeft: 4 }} />
          </View>
        </GlassPressable>

        {/* 20 KM Discovery: Nearby Agricultural Equipment */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>
              {ui.nearbyServices}
            </Text>
          </View>
          <GlassPressable
            onPress={() => onNavigateTab && onNavigateTab('equipment')}
            hapticType="selection"
          >
            <Text style={styles.viewAllText}>{ui.viewAll}</Text>
          </GlassPressable>
        </View>

        {/* Nearby Equipment List */}
        {nearbyItems.map((item) => (
          <EquipmentQuickCard
            key={item.id}
            item={{
              ...item,
              name: typeof item.name === 'object' ? item.name[language] : item.name,
              village: typeof item.village === 'object' ? item.village[language] : item.village,
            }}
            language={language}
            onBook={() => handleBookEquipmentItem(item)}
            onPress={() => handleBookEquipmentItem(item)}
          />
        ))}

        {/* Footer info strip */}
        <View style={styles.footerBrandBlock}>
          <Text style={styles.footerBrandText}>{brand.appName}</Text>
          <Text style={styles.footerCopyright}>
            {brand.footerSub}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 110, // Generous padding for floating glass dock
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  brandTitleGroup: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  brandTitle: {
    fontSize: Typography.sizes.headline,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  langText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginLeft: 4,
  },
  profileStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    padding: Spacing.md,
    borderRadius: Radii.xxl,
    marginBottom: Spacing.md,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.xs,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 185, 129, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  greetingGroup: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  userStatusText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginTop: 1,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  locationSelectorText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.primaryLight,
    marginLeft: 2,
    maxWidth: 110,
  },
  locationChangeLink: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  aiQuickBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 243, 255, 0.82)',
    borderRadius: Radii.xxl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1.2,
    borderColor: 'rgba(221, 214, 254, 0.9)',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  aiIconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: '#6D28D9',
  },
  aiSubtitle: {
    fontSize: Typography.sizes.xs,
    color: '#7C3AED',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  viewAllText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  moduleCard: {
    width: '48.5%',
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: Radii.xxl,
    padding: 13,
    marginBottom: Spacing.md,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'space-between',
    minHeight: 162,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  moduleIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  moduleTextGroup: {
    flex: 1,
  },
  moduleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleTitle: {
    fontSize: 13.5,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  moduleSubtitle: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    lineHeight: 14,
    marginTop: 3,
  },
  moduleFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  moduleBadge: {
    borderWidth: 1,
    borderRadius: Radii.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
    maxWidth: '75%',
  },
  moduleBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
  },
  soilBanner: {
    backgroundColor: 'rgba(254, 243, 199, 0.85)',
    borderRadius: Radii.xxl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1.2,
    borderColor: 'rgba(253, 230, 138, 0.9)',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  soilBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soilIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radii.lg,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  soilTextGroup: {
    flex: 1,
  },
  soilBannerTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: '#92400E',
  },
  soilBannerDesc: {
    fontSize: Typography.sizes.xs,
    color: '#B45309',
    marginTop: 2,
  },
  soilBannerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    marginTop: Spacing.sm,
    ...Shadows.subtle,
  },
  soilActionText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  footerBrandBlock: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    marginTop: Spacing.lg,
  },
  footerBrandText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  footerCopyright: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    marginTop: 4,
    textAlign: 'center',
  },
});
