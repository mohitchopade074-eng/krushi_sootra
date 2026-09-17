// KRUSHI-SOOTRA (कृषी-सूत्र)
// Farmer Home Dashboard Screen (Apple HIG Agricultural Mobile Design)

import React, { useState, useMemo } from 'react';
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
  APP_NAME,
  APP_NAME_DEVANAGARI,
  APP_TAGLINE,
  CORE_MODULES,
  ROLES,
  STRINGS,
} from '../constants/branding';
import WeatherCard from '../components/WeatherCard';
import EquipmentQuickCard from '../components/EquipmentQuickCard';
import StatusBadge from '../components/ui/StatusBadge';
import { filterByRadius, AGRICULTURAL_LOCATIONS } from '../services/locationService';

// Sample verified agricultural inventory situated near Pune / Maharashtra
const MOCK_NEARBY_EQUIPMENT = [
  {
    id: 'eq_1',
    name: 'महिंद्रा ५७५ DI ट्रॅक्टर (45 HP)',
    brand: 'Mahindra',
    model: '575 DI Bhoomiputra',
    category: 'Tractor',
    dailyPrice: 1800,
    acrePrice: 900,
    status: 'Available',
    latitude: 18.5300,
    longitude: 73.8700,
    village: 'हवेली, पुणे',
    rating: 4.9,
    reviewCount: 38,
  },
  {
    id: 'eq_2',
    name: 'शक्तीमान रोटाव्हेटर (७ फूट)',
    brand: 'Shaktiman',
    model: 'Champion Semi-Champion',
    category: 'Rotavator',
    dailyPrice: 1100,
    acrePrice: 550,
    status: 'Available',
    latitude: 18.5600,
    longitude: 73.8100,
    village: 'मांजरी, पुणे',
    rating: 4.8,
    reviewCount: 22,
  },
  {
    id: 'eq_3',
    name: 'हाय-टेक कृषी ड्रोन (फवारणी)',
    brand: 'IoTech',
    model: 'AgroBot 16L Tank',
    category: 'Drone',
    dailyPrice: 3500,
    acrePrice: 400,
    status: 'Available',
    latitude: 18.4900,
    longitude: 73.9100,
    village: 'हडपसर, पुणे',
    rating: 5.0,
    reviewCount: 16,
  },
  {
    id: 'eq_4',
    name: 'लेझर लँड लेव्हलर (जमीन सपाटीकरण)',
    brand: 'Gahir',
    model: 'Laser Level Pro',
    category: 'Leveler',
    dailyPrice: 2200,
    acrePrice: 1100,
    status: 'In Use',
    latitude: 18.6200,
    longitude: 73.7900,
    village: 'पिंपरी, पुणे',
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

  const strings = STRINGS[language] || STRINGS.mr;

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

  const cycleLocation = () => {
    const locKeys = Object.keys(AGRICULTURAL_LOCATIONS);
    const currentIndex = locKeys.findIndex(
      (k) => AGRICULTURAL_LOCATIONS[k].name === selectedLocation.name
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
          <View>
            <View style={styles.brandBadgeRow}>
              <Text style={styles.brandTitle}>{APP_NAME}</Text>
              <View style={styles.devanagariTag}>
                <Text style={styles.devanagariText}>{APP_NAME_DEVANAGARI}</Text>
              </View>
            </View>
            <Text style={styles.brandTagline}>{APP_TAGLINE}</Text>
          </View>

          {/* Language Switcher Pill */}
          <TouchableOpacity
            style={styles.langPill}
            onPress={toggleLanguage}
            activeOpacity={0.8}
          >
            <Ionicons name="globe-outline" size={16} color={Colors.primary} />
            <Text style={styles.langText}>
              {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'English'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Farmer Profile & Active Location Strip */}
        <View style={styles.profileStrip}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={20} color={Colors.primary} />
            </View>
            <View style={styles.greetingGroup}>
              <Text style={styles.greetingTitle}>
                {strings.welcome}, शेतकरी मित्र!
              </Text>
              <TouchableOpacity
                style={styles.locationSelector}
                onPress={cycleLocation}
                activeOpacity={0.7}
              >
                <Ionicons name="location" size={14} color={Colors.primaryLight} />
                <Text style={styles.locationSelectorText}>
                  {selectedLocation.name}
                </Text>
                <Text style={styles.locationChangeLink}>({strings.changeLocation})</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Active Role Badge */}
          <StatusBadge
            label={ROLES.FARMER.marathi}
            status="success"
            icon="leaf"
            size="small"
          />
        </View>

        {/* AI Krushi Assistant High-Priority Quick-Bar */}
        <TouchableOpacity
          style={styles.aiQuickBar}
          activeOpacity={0.88}
          onPress={() => onNavigateTab ? onNavigateTab('lab') : null}
        >
          <View style={styles.aiIconBubble}>
            <Ionicons name="sparkles" size={20} color="#7C3AED" />
          </View>
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>AI कृषी सल्लागार (AI Krushi Assistant)</Text>
            <Text style={styles.aiSubtitle}>
              शेतीतील कोणताही प्रश्न विचारा, झटपट मार्गदर्शन मिळवा
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        {/* Live Weather & Agro-Advisory Widget (Open-Meteo Integration) */}
        <WeatherCard
          latitude={selectedLocation.lat}
          longitude={selectedLocation.lon}
          locationName={selectedLocation.name}
          language={language}
        />

        {/* 5 Core Platform Modules Grid */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>कृषी सेवा केंद्र (Core Services)</Text>
          <Text style={styles.sectionSubtitle}>एकाच छताखाली शेतीची सर्व साधने</Text>
        </View>

        <View style={styles.modulesGrid}>
          {CORE_MODULES.map((mod) => (
            <TouchableOpacity
              key={mod.id}
              style={styles.moduleCard}
              onPress={() => handleModulePress(mod)}
              activeOpacity={0.85}
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
                    {language === 'mr' ? mod.titleMr : mod.titleEn}
                  </Text>
                </View>
                <Text style={styles.moduleSubtitle} numberOfLines={2}>
                  {mod.subtitleMr}
                </Text>
              </View>

              <View style={styles.moduleFooterRow}>
                <View style={[styles.moduleBadge, { borderColor: `${mod.color}40` }]}>
                  <Text style={[styles.moduleBadgeText, { color: mod.color }]}>
                    {mod.badge}
                  </Text>
                </View>
                <Ionicons name="arrow-forward-circle" size={22} color={mod.color} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Soil Health Scanner Special Banner */}
        <TouchableOpacity
          style={styles.soilBanner}
          activeOpacity={0.88}
          onPress={() => onNavigateTab ? onNavigateTab('lab') : null}
        >
          <View style={styles.soilBannerContent}>
            <View style={styles.soilIconBox}>
              <Ionicons name="document-text" size={26} color="#B45309" />
            </View>
            <View style={styles.soilTextGroup}>
              <Text style={styles.soilBannerTitle}>
                माती आरोग्य पत्रिका स्कॅन करा (Soil OCR)
              </Text>
              <Text style={styles.soilBannerDesc}>
                Tesseract OCR द्वारे नत्र (N), स्फुरद (P), पालाश (K) व pH चे झटपट वाचन
              </Text>
            </View>
          </View>
          <View style={styles.soilBannerAction}>
            <Text style={styles.soilActionText}>स्कॅन करा</Text>
            <Ionicons name="camera" size={16} color={Colors.primary} style={{ marginLeft: 4 }} />
          </View>
        </TouchableOpacity>

        {/* 20 KM Discovery: Nearby Agricultural Equipment */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>
              {strings.nearbyServices}
            </Text>
            <Text style={styles.sectionSubtitle}>
              Haversine सूत्रानुसार २० किमी परिसरात सत्यापित साधने
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onNavigateTab ? onNavigateTab('equipment') : null}
          >
            <Text style={styles.viewAllText}>{strings.viewAll}</Text>
          </TouchableOpacity>
        </View>

        {/* Nearby Equipment List */}
        {nearbyItems.map((item) => (
          <EquipmentQuickCard
            key={item.id}
            item={item}
            language={language}
            onBook={() => handleBookEquipmentItem(item)}
            onPress={() => handleBookEquipmentItem(item)}
          />
        ))}

        {/* Footer info strip */}
        <View style={styles.footerBrandBlock}>
          <Text style={styles.footerBrandText}>{APP_NAME} • {APP_NAME_DEVANAGARI}</Text>
          <Text style={styles.footerCopyright}>
            शेतकरी, अवजार मालक व मजुरांचे एकात्मिक डिजिटल व्यासपीठ
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
    paddingBottom: Spacing.huge,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  brandBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: Typography.sizes.headline,
    fontWeight: Typography.weights.heavy,
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  devanagariTag: {
    backgroundColor: Colors.mintTint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.sm,
    marginLeft: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.mintBorder,
  },
  devanagariText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  brandTagline: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
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
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radii.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.mintTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  greetingGroup: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationSelectorText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.primaryLight,
    marginLeft: 2,
  },
  locationChangeLink: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  aiQuickBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: Radii.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    ...Shadows.subtle,
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
    marginBottom: Spacing.lg,
  },
  moduleCard: {
    width: '48.5%',
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
    minHeight: 148,
    ...Shadows.subtle,
  },
  moduleIconBox: {
    width: 48,
    height: 48,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  moduleTextGroup: {
    flex: 1,
  },
  moduleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  moduleSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
    marginTop: 2,
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
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  moduleBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
  },
  soilBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: Radii.xl,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    ...Shadows.subtle,
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
