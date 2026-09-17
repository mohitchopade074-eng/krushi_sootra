// KRUSHI-SOOTRA (कृषी-सूत्र / कृषि-सूत्र)
// Equipment Rental Marketplace Screen (100% Pure Isolated Multilingual Standard)

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing, Typography } from '../constants/theme';
import EquipmentQuickCard from '../components/EquipmentQuickCard';
import BottomSheet from '../components/ui/BottomSheet';
import PrimaryButton from '../components/ui/PrimaryButton';
import GlassPressable from '../components/ui/GlassPressable';
import { filterByRadius, AGRICULTURAL_LOCATIONS } from '../services/locationService';

const EQUIPMENT_CATEGORIES = {
  mr: [
    { id: 'all', label: 'सर्व' },
    { id: 'tractor', label: 'ट्रॅक्टर' },
    { id: 'rotavator', label: 'रोटाव्हेटर' },
    { id: 'harvester', label: 'हार्वेस्टर' },
    { id: 'drone', label: 'ड्रोन' },
    { id: 'leveler', label: 'लेव्हलर' },
  ],
  hi: [
    { id: 'all', label: 'सभी' },
    { id: 'tractor', label: 'ट्रैक्टर' },
    { id: 'rotavator', label: 'रोटावेटर' },
    { id: 'harvester', label: 'हार्वेस्टर' },
    { id: 'drone', label: 'ड्रोन' },
    { id: 'leveler', label: 'लेवलर' },
  ],
  en: [
    { id: 'all', label: 'All' },
    { id: 'tractor', label: 'Tractor' },
    { id: 'rotavator', label: 'Rotavator' },
    { id: 'harvester', label: 'Harvester' },
    { id: 'drone', label: 'Drone' },
    { id: 'leveler', label: 'Leveler' },
  ],
};

const FULL_EQUIPMENT_DATA = [
  {
    id: 'eq_1',
    name: {
      mr: 'महिंद्रा ५७५ डीआय ट्रॅक्टर',
      hi: 'महिंद्रा ५७५ डीआई ट्रैक्टर',
      en: 'Mahindra 575 DI Tractor (45 HP)',
    },
    brand: 'Mahindra',
    model: '575 DI Bhoomiputra',
    category: 'tractor',
    dailyPrice: 1800,
    acrePrice: 900,
    hourlyPrice: 350,
    status: 'Available',
    latitude: 18.5300,
    longitude: 73.8700,
    village: { mr: 'हवेली, पुणे', hi: 'हवेली, पुणे', en: 'Haveli, Pune' },
    ownerName: { mr: 'बाळासाहेब जाधव', hi: 'बालासाहेब जाधव', en: 'Balasaheb Jadhav' },
    ownerPhone: '+91 98220 12345',
    rating: 4.9,
    reviewCount: 38,
    features: {
      mr: ['पॉवर स्टिअरिंग', 'ड्युअल क्लच', 'डिझेल कार्यक्षम', 'ट्रॉली उपलब्ध'],
      hi: ['पावर स्टीयरिंग', 'ड्यूल क्लच', 'डीजल बचत', 'ट्रॉली उपलब्ध'],
      en: ['Power Steering', 'Dual Clutch', 'Fuel Efficient', 'Trolley Available'],
    },
  },
  {
    id: 'eq_2',
    name: {
      mr: 'शक्तीमान रोटाव्हेटर (७ फूट)',
      hi: 'शक्तिमान रोटावेटर (७ फीट)',
      en: 'Shaktiman Rotavator (7 ft)',
    },
    brand: 'Shaktiman',
    model: 'Champion Semi-Champion',
    category: 'rotavator',
    dailyPrice: 1100,
    acrePrice: 550,
    hourlyPrice: 200,
    status: 'Available',
    latitude: 18.5600,
    longitude: 73.8100,
    village: { mr: 'मांजरी, पुणे', hi: 'मांजरी, पुणे', en: 'Manjari, Pune' },
    ownerName: { mr: 'सचिन शिंदे', hi: 'सचिन शिंदे', en: 'Sachin Shinde' },
    ownerPhone: '+91 98220 54321',
    rating: 4.8,
    reviewCount: 22,
    features: {
      mr: ['हेव्ही ड्युटी ब्लेड्स', 'कडक जमिनीसाठी उत्तम', 'गियर ड्राइव्ह'],
      hi: ['मजबूत ब्लेड्स', 'कठोर भूमि के लिए उत्तम', 'गियर ड्राइव'],
      en: ['Heavy Duty Blades', 'Ideal for Hard Soil', 'Gear Drive'],
    },
  },
  {
    id: 'eq_3',
    name: {
      mr: 'हाय-टेक कृषी फवारणी ड्रोन',
      hi: 'हाई-टेक कृषि छिड़काव ड्रोन',
      en: 'Hi-Tech Agri Spraying Drone (16L)',
    },
    brand: 'IoTech',
    model: 'AgroBot 16L Hexacopter',
    category: 'drone',
    dailyPrice: 3500,
    acrePrice: 400,
    hourlyPrice: 600,
    status: 'Available',
    latitude: 18.4900,
    longitude: 73.9100,
    village: { mr: 'हडपसर, पुणे', hi: 'हड़पसर, पुणे', en: 'Hadapsar, Pune' },
    ownerName: { mr: 'अमोल पाटील (पायलट)', hi: 'अमोल पाटिल (पायलट)', en: 'Amol Patil (Certified Pilot)' },
    ownerPhone: '+91 98900 87654',
    rating: 5.0,
    reviewCount: 16,
    features: {
      mr: ['१० मिनिटात १ एकर फवारणी', 'अचूक औषध वापर', 'सत्यापित पायलट'],
      hi: ['१० मिनट में १ एकड़ छिड़काव', 'सटीक दवा प्रयोग', 'सत्यापित पायलट'],
      en: ['1 Acre Spray in 10 mins', 'Precise Chemical Use', 'Certified Pilot'],
    },
  },
  {
    id: 'eq_4',
    name: {
      mr: 'लेझर जमीन सपाटीकरण यंत्र',
      hi: 'लेजर भूमि समतलीकरण यंत्र',
      en: 'Laser Land Leveler Pro-7',
    },
    brand: 'Gahir',
    model: 'Laser Level Pro-7',
    category: 'leveler',
    dailyPrice: 2200,
    acrePrice: 1100,
    hourlyPrice: 450,
    status: 'Available',
    latitude: 18.6200,
    longitude: 73.7900,
    village: { mr: 'पिंपरी, पुणे', hi: 'पिंपरी, पुणे', en: 'Pimpri, Pune' },
    ownerName: { mr: 'दत्तात्रय गायकवाड', hi: 'दत्तात्रेय गायकवाड़', en: 'Dattatray Gaikwad' },
    ownerPhone: '+91 97630 11223',
    rating: 4.7,
    reviewCount: 19,
    features: {
      mr: ['३०% पाण्याची बचत', 'अचूक सपाटी', 'ट्रॅक्टरसह उपलब्ध'],
      hi: ['३०% पानी की बचत', 'सटीक समतलीकरण', 'ट्रैक्टर सहित'],
      en: ['30% Water Savings', 'Precision Leveling', 'Tractor Included'],
    },
  },
  {
    id: 'eq_5',
    name: {
      mr: 'प्रीत कम्बाईन कापणी यंत्र',
      hi: 'प्रीत कंबाइन कटाई यंत्र',
      en: 'Preet Combine Harvester',
    },
    brand: 'Preet',
    model: '987 Multi-Crop',
    category: 'harvester',
    dailyPrice: 6500,
    acrePrice: 1800,
    hourlyPrice: 1200,
    status: 'Available',
    latitude: 18.5800,
    longitude: 73.9500,
    village: { mr: 'लोणी काळभोर, पुणे', hi: 'लोनी कालभोर, पुणे', en: 'Loni Kalbhor, Pune' },
    ownerName: { mr: 'रामभाऊ कदम', hi: 'रामभाऊ कदम', en: 'Rambhau Kadam' },
    ownerPhone: '+91 94230 99887',
    rating: 4.9,
    reviewCount: 45,
    features: {
      mr: ['गहू, सोयाबीन, हरभरा कापणी', 'स्वच्छ दाणे', 'कमी नुकसान'],
      hi: ['गेहूं, सोयाबीन, चना कटाई', 'साफ दाने', 'न्यूनतम बर्बादी'],
      en: ['Wheat, Soybean, Gram Harvesting', 'Clean Grain Output', 'Zero Loss'],
    },
  },
];

const LOCALIZED_TEXTS = {
  mr: {
    title: 'कृषी अवजारे मार्केटप्लेस',
    subtitle: 'जवळपास उपलब्ध ट्रॅक्टर व आधुनिक शेती यंत्रे',
    searchPlaceholder: 'अवजार, ट्रॅक्टर किंवा मॉडेल शोधा...',
    availableInRadius: 'अवजारे उपलब्ध (२०-३० किमी)',
    directRate: 'शेतकरी थेट दर',
    noEquipmentFound: 'कोणतेही अवजार सापडले नाही',
    noEquipmentSub: 'कृपया वेगळा शोध शब्द वापरा किंवा इतर श्रेणी निवडा.',
    selectBookingMode: 'बुकिंग प्रकार निवडा',
    dailyMode: 'दिवस हिशोबाने',
    acreMode: 'एकर हिशोबाने',
    daysCount: 'दिवसांची संख्या:',
    acresCount: 'एकर संख्या:',
    baseRent: 'मूळ भाडे दर:',
    platformFee: 'प्लॅटफॉर्म सुरक्षा शुल्क:',
    totalPayable: 'एकूण देय रक्कम:',
    safetyGuarantee: 'कृषी-सूत्र हमी: एकाच वेळेस दुहेरी बुकिंग प्रतिबंध व थेट मालक समन्वय.',
    confirmBooking: 'बुकिंग निश्चित करा',
    bookingSuccessTitle: 'बुकिंग यशस्वी!',
    ownerLabel: 'मालक:',
  },
  hi: {
    title: 'कृषि उपकरण मार्केटप्लेस',
    subtitle: 'आसपास उपलब्ध ट्रैक्टर और आधुनिक कृषि मशीनें',
    searchPlaceholder: 'उपकरण, ट्रैक्टर या मॉडल खोजें...',
    availableInRadius: 'उपकरण उपलब्ध (२०-३० किमी)',
    directRate: 'किसान सीधा दर',
    noEquipmentFound: 'कोई उपकरण नहीं मिला',
    noEquipmentSub: 'कृपया अन्य खोज शब्द का प्रयोग करें या श्रेणी बदलें।',
    selectBookingMode: 'बुकिंग प्रकार चुनें',
    dailyMode: 'दिन के अनुसार',
    acreMode: 'एकड़ के अनुसार',
    daysCount: 'दिनों की संख्या:',
    acresCount: 'एकड़ संख्या:',
    baseRent: 'मूल किराया दर:',
    platformFee: 'प्लेटफॉर्म सुरक्षा शुल्क:',
    totalPayable: 'कुल देय राशि:',
    safetyGuarantee: 'कृषि-सूत्र गारंटी: दोहरा बुकिंग निषेध एवं सीधा मालिक समन्वय।',
    confirmBooking: 'बुकिंग पक्की करें',
    bookingSuccessTitle: 'बुकिंग सफल!',
    ownerLabel: 'मालिक:',
  },
  en: {
    title: 'Farm Equipment Marketplace',
    subtitle: 'Available tractors and modern agricultural implements nearby',
    searchPlaceholder: 'Search equipment, tractor or brand...',
    availableInRadius: 'implements available (20-30 km)',
    directRate: 'Direct Farmer Rates',
    noEquipmentFound: 'No Equipment Found',
    noEquipmentSub: 'Please try another search keyword or switch categories.',
    selectBookingMode: 'Select Booking Mode',
    dailyMode: 'Daily Basis',
    acreMode: 'Acre Basis',
    daysCount: 'Number of Days:',
    acresCount: 'Number of Acres:',
    baseRent: 'Base Rental Rate:',
    platformFee: 'Platform Security Fee:',
    totalPayable: 'Total Payable Amount:',
    safetyGuarantee: 'Krushi-Sootra Guarantee: Zero double-booking & verified owner coordination.',
    confirmBooking: 'Confirm Reservation',
    bookingSuccessTitle: 'Booking Confirmed!',
    ownerLabel: 'Owner:',
  },
};

export default function EquipmentScreen({
  language = 'mr',
  onBookingConfirmed,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingDays, setBookingDays] = useState(1);
  const [bookingMode, setBookingMode] = useState('daily');
  const [acreCount, setAcreCount] = useState(2);

  const t = LOCALIZED_TEXTS[language] || LOCALIZED_TEXTS.mr;
  const categories = EQUIPMENT_CATEGORIES[language] || EQUIPMENT_CATEGORIES.mr;
  const activeLoc = AGRICULTURAL_LOCATIONS.PUNE;

  const filteredEquipment = useMemo(() => {
    let items = filterByRadius(
      FULL_EQUIPMENT_DATA,
      activeLoc.lat,
      activeLoc.lon,
      30
    );

    if (selectedCategory !== 'all') {
      items = items.filter((it) => it.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((it) => {
        const name = (it.name[language] || it.name.mr).toLowerCase();
        const brand = it.brand.toLowerCase();
        const village = (it.village[language] || it.village.mr).toLowerCase();
        return name.includes(q) || brand.includes(q) || village.includes(q);
      });
    }

    return items;
  }, [selectedCategory, searchQuery, activeLoc, language]);

  const openBookingSheet = (item) => {
    setSelectedItem(item);
    setBookingDays(1);
    setAcreCount(2);
    setBookingModalVisible(true);
  };

  const calculateTotal = () => {
    if (!selectedItem) return { base: 0, platformFee: 49, total: 49 };
    const base =
      bookingMode === 'daily'
        ? selectedItem.dailyPrice * bookingDays
        : selectedItem.acrePrice * acreCount;
    const platformFee = 49;
    return { base, platformFee, total: base + platformFee };
  };

  const handleConfirmBooking = () => {
    const cost = calculateTotal();
    const itemName = selectedItem.name[language] || selectedItem.name.mr;
    const owner = selectedItem.ownerName[language] || selectedItem.ownerName.mr;

    const newBooking = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      resourceType: 'equipment',
      resourceName: itemName,
      providerName: owner,
      totalAmount: cost.total,
      date: new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'mr-IN'),
      status: 'Confirmed',
    };

    setBookingModalVisible(false);
    if (onBookingConfirmed) {
      onBookingConfirmed(newBooking);
    }

    Alert.alert(
      t.bookingSuccessTitle,
      `${itemName}\n${t.totalPayable}: ₹${cost.total}\n${t.ownerLabel} ${owner} (${selectedItem.ownerPhone})`
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Search & Title */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        {/* Search Input */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.searchPlaceholder}
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Pills Slider */}
      <View style={styles.categoryPillsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsContent}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <GlassPressable
                key={cat.id}
                style={[styles.pill, isSelected && styles.selectedPill]}
                onPress={() => setSelectedCategory(cat.id)}
                hapticType="selection"
              >
                <Text style={[styles.pillText, isSelected && styles.selectedPillText]}>
                  {cat.label}
                </Text>
              </GlassPressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Equipment List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsMetaRow}>
          <Text style={styles.resultsCountText}>
            {filteredEquipment.length} {t.availableInRadius}
          </Text>
          <View style={styles.verifiedTag}>
            <Ionicons name="shield-checkmark" size={14} color={Colors.primary} />
            <Text style={styles.verifiedTagText}>{t.directRate}</Text>
          </View>
        </View>

        {filteredEquipment.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="construct-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyStateTitle}>{t.noEquipmentFound}</Text>
            <Text style={styles.emptyStateDesc}>{t.noEquipmentSub}</Text>
          </View>
        ) : (
          filteredEquipment.map((item) => (
            <EquipmentQuickCard
              key={item.id}
              item={{
                ...item,
                name: item.name[language] || item.name.mr,
                village: item.village[language] || item.village.mr,
              }}
              language={language}
              onPress={() => openBookingSheet(item)}
              onBook={() => openBookingSheet(item)}
            />
          ))
        )}
      </ScrollView>

      {/* Booking Bottom Sheet */}
      <BottomSheet
        visible={bookingModalVisible}
        onClose={() => setBookingModalVisible(false)}
        title={selectedItem ? (selectedItem.name[language] || selectedItem.name.mr) : ''}
        subtitle={selectedItem ? `${selectedItem.village[language] || selectedItem.village.mr} • ${selectedItem.ownerName[language] || selectedItem.ownerName.mr}` : ''}
      >
        {selectedItem && (
          <View style={styles.sheetBody}>
            {/* Features Tags */}
            <View style={styles.featuresRow}>
              {(selectedItem.features[language] || selectedItem.features.mr).map((feat, idx) => (
                <View key={idx} style={styles.featureBadge}>
                  <Text style={styles.featureBadgeText}>✓ {feat}</Text>
                </View>
              ))}
            </View>

            {/* Booking Mode Selector (Daily vs Acre) */}
            <Text style={styles.formSectionTitle}>{t.selectBookingMode}</Text>
            <View style={styles.modeToggleRow}>
              <TouchableOpacity
                style={[styles.modeButton, bookingMode === 'daily' && styles.modeButtonActive]}
                onPress={() => setBookingMode('daily')}
              >
                <Text style={[styles.modeButtonText, bookingMode === 'daily' && styles.modeButtonTextActive]}>
                  {t.dailyMode} (₹{selectedItem.dailyPrice})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeButton, bookingMode === 'acre' && styles.modeButtonActive]}
                onPress={() => setBookingMode('acre')}
              >
                <Text style={[styles.modeButtonText, bookingMode === 'acre' && styles.modeButtonTextActive]}>
                  {t.acreMode} (₹{selectedItem.acrePrice})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Counter (Days or Acres) */}
            <View style={styles.counterRow}>
              <Text style={styles.counterLabel}>
                {bookingMode === 'daily' ? t.daysCount : t.acresCount}
              </Text>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => {
                    if (bookingMode === 'daily') {
                      if (bookingDays > 1) setBookingDays(bookingDays - 1);
                    } else {
                      if (acreCount > 1) setAcreCount(acreCount - 1);
                    }
                  }}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.counterValue}>
                  {bookingMode === 'daily' ? bookingDays : acreCount}
                </Text>

                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => {
                    if (bookingMode === 'daily') setBookingDays(bookingDays + 1);
                    else setAcreCount(acreCount + 1);
                  }}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Cost Breakdown */}
            <View style={styles.costBox}>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>{t.baseRent}</Text>
                <Text style={styles.costVal}>₹{calculateTotal().base}</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>{t.platformFee}</Text>
                <Text style={styles.costVal}>₹{calculateTotal().platformFee}</Text>
              </View>
              <View style={styles.costDivider} />
              <View style={styles.costRow}>
                <Text style={styles.totalLabel}>{t.totalPayable}</Text>
                <Text style={styles.totalVal}>₹{calculateTotal().total}</Text>
              </View>
            </View>

            {/* Safety Guarantee */}
            <View style={styles.safetyNote}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.primary} />
              <Text style={styles.safetyNoteText}>{t.safetyGuarantee}</Text>
            </View>

            {/* Action Button */}
            <PrimaryButton
              title={t.confirmBooking}
              icon="checkmark-circle"
              onPress={handleConfirmBooking}
              style={{ marginTop: Spacing.md }}
            />
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.sizes.headline,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.md,
    height: 44,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.sizes.body,
    color: Colors.textPrimary,
  },
  categoryPillsWrapper: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryPillsContent: {
    paddingHorizontal: Spacing.lg,
  },
  pill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    marginRight: Spacing.sm,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  selectedPill: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 3,
  },
  pillText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  selectedPillText: {
    color: Colors.textInverse,
    fontWeight: Typography.weights.bold,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 110, // Avoid overlap with floating bottom nav
  },
  resultsMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultsCountText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedTagText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
    marginLeft: 3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptyStateDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: Spacing.xl,
  },
  sheetBody: {
    paddingBottom: Spacing.lg,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  featureBadge: {
    backgroundColor: Colors.mintTint,
    borderRadius: Radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.mintBorder,
  },
  featureBadgeText: {
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
    color: Colors.primaryDark,
  },
  formSectionTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  modeToggleRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceMuted,
    marginRight: 6,
    alignItems: 'center',
  },
  modeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.mintTint,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  modeButtonTextActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  counterLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    fontSize: 18,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  counterValue: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    marginHorizontal: Spacing.lg,
  },
  costBox: {
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  costLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  costVal: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  costDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 6,
  },
  totalLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  totalVal: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.heavy,
    color: Colors.primary,
  },
  safetyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.mintTint,
    borderRadius: Radii.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  safetyNoteText: {
    fontSize: 11,
    color: Colors.primaryDark,
    marginLeft: 6,
    flex: 1,
  },
});
