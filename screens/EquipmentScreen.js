// KRUSHI-SOOTRA (कृषी-सूत्र)
// Equipment Rental Marketplace Screen (Apple HIG Agricultural Standard)

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
import StatusBadge from '../components/ui/StatusBadge';
import { filterByRadius, AGRICULTURAL_LOCATIONS } from '../services/locationService';

const EQUIPMENT_CATEGORIES = [
  { id: 'all', labelMr: 'सर्व', labelEn: 'All' },
  { id: 'tractor', labelMr: 'ट्रॅक्टर', labelEn: 'Tractor' },
  { id: 'rotavator', labelMr: 'रोटाव्हेटर', labelEn: 'Rotavator' },
  { id: 'harvester', labelMr: 'हार्वेस्टर', labelEn: 'Harvester' },
  { id: 'drone', labelMr: 'ड्रोन', labelEn: 'Drone' },
  { id: 'leveler', labelMr: 'लेव्हलर', labelEn: 'Leveler' },
];

const FULL_EQUIPMENT_DATA = [
  {
    id: 'eq_1',
    name: 'महिंद्रा ५७५ DI ट्रॅक्टर (45 HP)',
    brand: 'Mahindra',
    model: '575 DI Bhoomiputra',
    category: 'tractor',
    dailyPrice: 1800,
    acrePrice: 900,
    hourlyPrice: 350,
    status: 'Available',
    latitude: 18.5300,
    longitude: 73.8700,
    village: 'हवेली, पुणे',
    ownerName: 'बाळासाहेब जाधव',
    ownerPhone: '+91 98220 12345',
    rating: 4.9,
    reviewCount: 38,
    features: ['पॉवर स्टिअरिंग', 'ड्युअल क्लच', 'डिझेल कार्यक्षम', 'ट्रॉली उपलब्ध'],
  },
  {
    id: 'eq_2',
    name: 'शक्तीमान रोटाव्हेटर (७ फूट)',
    brand: 'Shaktiman',
    model: 'Champion Semi-Champion',
    category: 'rotavator',
    dailyPrice: 1100,
    acrePrice: 550,
    hourlyPrice: 200,
    status: 'Available',
    latitude: 18.5600,
    longitude: 73.8100,
    village: 'मांजरी, पुणे',
    ownerName: 'सचिन शिंदे',
    ownerPhone: '+91 98220 54321',
    rating: 4.8,
    reviewCount: 22,
    features: ['हेव्ही ड्युटी ब्लेड्स', 'कडक जमिनीसाठी उत्तम', 'गियर ड्राइव्ह'],
  },
  {
    id: 'eq_3',
    name: 'हाय-टेक कृषी ड्रोन (१६ लिटर फवारणी)',
    brand: 'IoTech',
    model: 'AgroBot 16L Hexacopter',
    category: 'drone',
    dailyPrice: 3500,
    acrePrice: 400,
    hourlyPrice: 600,
    status: 'Available',
    latitude: 18.4900,
    longitude: 73.9100,
    village: 'हडपसर, पुणे',
    ownerName: 'अमोल पाटील (ड्रोन ऑपरेटर)',
    ownerPhone: '+91 98900 87654',
    rating: 5.0,
    reviewCount: 16,
    features: ['१० मिनिटात १ एकर फवारणी', 'अचूक औषध वापर', 'सत्यापित पायलट'],
  },
  {
    id: 'eq_4',
    name: 'लेझर लँड लेव्हलर (जमीन सपाटीकरण)',
    brand: 'Gahir',
    model: 'Laser Level Pro-7',
    category: 'leveler',
    dailyPrice: 2200,
    acrePrice: 1100,
    hourlyPrice: 450,
    status: 'Available',
    latitude: 18.6200,
    longitude: 73.7900,
    village: 'पिंपरी, पुणे',
    ownerName: 'दत्तात्रय गायकवाड',
    ownerPhone: '+91 97630 11223',
    rating: 4.7,
    reviewCount: 19,
    features: ['३०% पाण्याची बचत', 'अचूक सपाटी', 'ट्रॅक्टरसह उपलब्ध'],
  },
  {
    id: 'eq_5',
    name: 'प्रीत कम्बाईन हार्वेस्टर (धान्य कापणी)',
    brand: 'Preet',
    model: '987 Multi-Crop',
    category: 'harvester',
    dailyPrice: 6500,
    acrePrice: 1800,
    hourlyPrice: 1200,
    status: 'Available',
    latitude: 18.5800,
    longitude: 73.9500,
    village: 'लोणी काळभोर, पुणे',
    ownerName: 'रामभाऊ कदम',
    ownerPhone: '+91 94230 99887',
    rating: 4.9,
    reviewCount: 45,
    features: ['गहू, सोयाबीन, हरभरा कापणी', 'स्वच्छ दाणे', 'कमी नुकसान'],
  },
];

export default function EquipmentScreen({
  language = 'mr',
  onBookingConfirmed,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingDays, setBookingDays] = useState(1);
  const [bookingMode, setBookingMode] = useState('daily'); // 'daily' | 'acre'
  const [acreCount, setAcreCount] = useState(2);

  const activeLoc = AGRICULTURAL_LOCATIONS.PUNE;

  // Filter by radius & category & search query
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
      items = items.filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.brand.toLowerCase().includes(q) ||
          it.village.toLowerCase().includes(q)
      );
    }

    return items;
  }, [selectedCategory, searchQuery, activeLoc]);

  const openBookingSheet = (item) => {
    setSelectedItem(item);
    setBookingDays(1);
    setAcreCount(2);
    setBookingModalVisible(true);
  };

  const calculateTotal = () => {
    if (!selectedItem) return 0;
    const base =
      bookingMode === 'daily'
        ? selectedItem.dailyPrice * bookingDays
        : selectedItem.acrePrice * acreCount;
    const platformFee = 49; // Nominal zero-cost transparent fee
    return { base, platformFee, total: base + platformFee };
  };

  const handleConfirmBooking = () => {
    const cost = calculateTotal();
    const newBooking = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      resourceType: 'equipment',
      resourceName: selectedItem.name,
      providerName: selectedItem.ownerName,
      totalAmount: cost.total,
      date: new Date().toLocaleDateString('mr-IN'),
      status: 'Confirmed',
    };

    setBookingModalVisible(false);
    if (onBookingConfirmed) {
      onBookingConfirmed(newBooking);
    }

    Alert.alert(
      'बुकिंग यशस्वी!',
      `${selectedItem.name} चे बुकिंग यशस्वीरीत्या झाले आहे.\nएकूण रक्कम: ₹${cost.total}\nमालक: ${selectedItem.ownerName} (${selectedItem.ownerPhone})`
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Search & Title */}
      <View style={styles.header}>
        <Text style={styles.title}>कृषी अवजारे मार्केटप्लेस</Text>
        <Text style={styles.subtitle}>
          जवळपास उपलब्ध ट्रॅक्टर व आधुनिक शेती यंत्रे
        </Text>

        {/* Apple HIG Inset Search Input */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="अवजार, ट्रॅक्टर किंवा मॉडेल शोधा..."
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
          {EQUIPMENT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.pill,
                  isSelected && styles.selectedPill,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.pillText,
                    isSelected && styles.selectedPillText,
                  ]}
                >
                  {language === 'mr' ? cat.labelMr : cat.labelEn}
                </Text>
              </TouchableOpacity>
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
            {filteredEquipment.length} अवजारे उपलब्ध (२०-३० किमी)
          </Text>
          <View style={styles.verifiedTag}>
            <Ionicons name="shield-checkmark" size={14} color={Colors.primary} />
            <Text style={styles.verifiedTagText}>शेतकरी थेट दर</Text>
          </View>
        </View>

        {filteredEquipment.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="construct-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyStateTitle}>कोणतेही अवजार सापडले नाही</Text>
            <Text style={styles.emptyStateDesc}>
              कृपया वेगळा शोध शब्द वापरा किंवा इतर श्रेणी निवडा.
            </Text>
          </View>
        ) : (
          filteredEquipment.map((item) => (
            <EquipmentQuickCard
              key={item.id}
              item={item}
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
        title={selectedItem?.name}
        subtitle={`${selectedItem?.village} • ${selectedItem?.ownerName}`}
      >
        {selectedItem && (
          <View style={styles.sheetBody}>
            {/* Features Tags */}
            <View style={styles.featuresRow}>
              {selectedItem.features.map((feat, idx) => (
                <View key={idx} style={styles.featureBadge}>
                  <Text style={styles.featureBadgeText}>✓ {feat}</Text>
                </View>
              ))}
            </View>

            {/* Booking Mode Selector (Daily vs Acre) */}
            <Text style={styles.formSectionTitle}>बुकिंग प्रकार निवडा</Text>
            <View style={styles.modeToggleRow}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  bookingMode === 'daily' && styles.modeButtonActive,
                ]}
                onPress={() => setBookingMode('daily')}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    bookingMode === 'daily' && styles.modeButtonTextActive,
                  ]}
                >
                  दिवस हिशोबाने (₹{selectedItem.dailyPrice}/दिवस)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeButton,
                  bookingMode === 'acre' && styles.modeButtonActive,
                ]}
                onPress={() => setBookingMode('acre')}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    bookingMode === 'acre' && styles.modeButtonTextActive,
                  ]}
                >
                  एकर हिशोबाने (₹{selectedItem.acrePrice}/एकर)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Counter (Days or Acres) */}
            <View style={styles.counterRow}>
              <Text style={styles.counterLabel}>
                {bookingMode === 'daily' ? 'दिवसांची संख्या:' : 'एकर संख्या:'}
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
                <Text style={styles.costLabel}>मूळ भाडे दर:</Text>
                <Text style={styles.costVal}>₹{calculateTotal().base}</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>प्लॅटफॉर्म सुरक्षा व हमी शुल्क:</Text>
                <Text style={styles.costVal}>₹{calculateTotal().platformFee}</Text>
              </View>
              <View style={styles.costDivider} />
              <View style={styles.costRow}>
                <Text style={styles.totalLabel}>एकूण देय रक्कम:</Text>
                <Text style={styles.totalVal}>₹{calculateTotal().total}</Text>
              </View>
            </View>

            {/* Double-booking safety note */}
            <View style={styles.safetyNote}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.primary} />
              <Text style={styles.safetyNoteText}>
                कृषी-सूत्र हमी: एकाच वेळेस दुहेरी बुकिंग प्रतिबंध व थेट मालक समन्वय.
              </Text>
            </View>

            {/* Prominent Action Button */}
            <PrimaryButton
              title="बुकिंग निश्चित करा"
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
    paddingVertical: 7,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceMuted,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedPill: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
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
    ...Shadows.subtle,
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
