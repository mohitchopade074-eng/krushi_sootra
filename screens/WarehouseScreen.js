// KRUSHI-SOOTRA (कृषी-सूत्र)
// Warehouse & Cold Storage Space Reservation Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing, Typography } from '../constants/theme';
import StatusBadge from '../components/ui/StatusBadge';
import BottomSheet from '../components/ui/BottomSheet';
import PrimaryButton from '../components/ui/PrimaryButton';

const WAREHOUSE_DATA = [
  {
    id: 'wh_1',
    name: 'सह्याद्री ॲग्रो कोल्ड स्टोरेज व पॅकहाऊस',
    type: 'Cold Storage',
    isColdStorage: true,
    tempRange: '-2°C ते 4°C',
    capacityTons: 1500,
    availableTons: 420,
    pricePerTonMonth: 650,
    village: 'हवेली, पुणे',
    ownerName: 'अशोकराव पवार',
    phone: '+91 98224 88776',
    cctv: true,
    insured: true,
    suitableFor: ['द्राक्षे', 'डाळिंब', 'कांदा', 'भाजीपाला', 'सफरचंद'],
  },
  {
    id: 'wh_2',
    name: 'किसान समृद्धी धान्य व डाळ वेअरहाऊस',
    type: 'Dry Warehouse',
    isColdStorage: false,
    capacityTons: 3000,
    availableTons: 1100,
    pricePerTonMonth: 280,
    village: 'शिक्रापूर, पुणे',
    ownerName: 'तानाजी जगताप',
    phone: '+91 98225 33445',
    cctv: true,
    insured: true,
    suitableFor: ['सोयाबीन', 'गहू', 'हरभरा', 'तूर', 'मका'],
  },
  {
    id: 'wh_3',
    name: 'श्री गणेश आधुनिक कांदा चाळ व साठवणूक',
    type: 'Ventilated Onion Storage',
    isColdStorage: false,
    capacityTons: 800,
    availableTons: 250,
    pricePerTonMonth: 320,
    village: 'चाकण, पुणे',
    ownerName: 'रमेश खेडकर',
    phone: '+91 98226 55667',
    cctv: true,
    insured: false,
    suitableFor: ['लाल कांदा', 'उन्हाळी कांदा', 'लसूण'],
  },
];

export default function WarehouseScreen({ onBookingConfirmed }) {
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [tonsRequested, setTonsRequested] = useState(10);
  const [monthsCount, setMonthsCount] = useState(2);
  const [onlyColdStorage, setOnlyColdStorage] = useState(false);

  const displayedList = onlyColdStorage
    ? WAREHOUSE_DATA.filter((w) => w.isColdStorage)
    : WAREHOUSE_DATA;

  const openReserve = (wh) => {
    setSelectedStorage(wh);
    setTonsRequested(10);
    setMonthsCount(2);
    setSheetVisible(true);
  };

  const calculateEstimate = () => {
    if (!selectedStorage) return 0;
    return tonsRequested * monthsCount * selectedStorage.pricePerTonMonth;
  };

  const handleConfirmReservation = () => {
    const total = calculateEstimate();
    const newBooking = {
      id: `WH-${Date.now().toString().slice(-6)}`,
      resourceType: 'warehouse',
      resourceName: `${selectedStorage.name} (${tonsRequested} टन / ${monthsCount} महिने)`,
      providerName: selectedStorage.ownerName,
      totalAmount: total,
      date: new Date().toLocaleDateString('mr-IN'),
      status: 'Confirmed',
    };

    setSheetVisible(false);
    if (onBookingConfirmed) {
      onBookingConfirmed(newBooking);
    }

    Alert.alert(
      'जागा आरक्षण निश्चित!',
      `${selectedStorage.name} मध्ये ${tonsRequested} टन जागेचे यशस्वी आरक्षण झाले आहे.\nएकूण अंदाजे भाडे: ₹${total}\nमालकाशी संपर्क: ${selectedStorage.phone}`
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>गोदाम व शीतगृह साठवणूक</Text>
        <Text style={styles.subtitle}>
          हमीभाव मिळेपर्यंत धान्य व फळे सुरक्षित ठेवा
        </Text>

        {/* Filter Toggle */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, !onlyColdStorage && styles.filterChipActive]}
            onPress={() => setOnlyColdStorage(false)}
          >
            <Text
              style={[
                styles.filterChipText,
                !onlyColdStorage && styles.filterChipTextActive,
              ]}
            >
              सर्व साठवणूक ({WAREHOUSE_DATA.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, onlyColdStorage && styles.filterChipActive]}
            onPress={() => setOnlyColdStorage(true)}
          >
            <Ionicons
              name="snow"
              size={14}
              color={onlyColdStorage ? Colors.textInverse : Colors.info}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.filterChipText,
                onlyColdStorage && styles.filterChipTextActive,
              ]}
            >
              फक्त शीतगृह (Cold Storage)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {displayedList.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: item.isColdStorage ? '#E0F2FE' : Colors.mintTint },
                ]}
              >
                <Ionicons
                  name={item.isColdStorage ? 'snow' : 'business'}
                  size={24}
                  color={item.isColdStorage ? Colors.info : Colors.primary}
                />
              </View>

              <View style={styles.cardMainInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.location}>📍 {item.village}</Text>
              </View>

              <StatusBadge
                label={`${item.availableTons} टन मोकळे`}
                status="success"
                size="small"
              />
            </View>

            {/* Badges strip: CCTV, Insurance, Temp */}
            <View style={styles.specStrip}>
              {item.isColdStorage && (
                <View style={styles.specBadge}>
                  <Ionicons name="thermometer-outline" size={13} color={Colors.info} />
                  <Text style={styles.specText}>{item.tempRange}</Text>
                </View>
              )}
              {item.cctv && (
                <View style={styles.specBadge}>
                  <Ionicons name="videocam-outline" size={13} color={Colors.primaryLight} />
                  <Text style={styles.specText}>CCTV सुरक्षित</Text>
                </View>
              )}
              {item.insured && (
                <View style={styles.specBadge}>
                  <Ionicons name="shield-checkmark-outline" size={13} color="#B45309" />
                  <Text style={styles.specText}>विमा संरक्षित</Text>
                </View>
              )}
            </View>

            {/* Suitable crops tags */}
            <View style={styles.cropsRow}>
              <Text style={styles.cropsLabel}>योग्य पिके: </Text>
              {item.suitableFor.map((crop, idx) => (
                <Text key={idx} style={styles.cropName}>
                  {crop}
                  {idx < item.suitableFor.length - 1 ? ', ' : ''}
                </Text>
              ))}
            </View>

            {/* Pricing and Action */}
            <View style={styles.footerRow}>
              <View>
                <Text style={styles.priceSub}>साठवणूक दर:</Text>
                <Text style={styles.price}>
                  ₹{item.pricePerTonMonth}
                  <Text style={styles.priceUnit}> /टन/महिना</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={styles.reserveBtn}
                onPress={() => openReserve(item)}
              >
                <Text style={styles.reserveBtnText}>जागा आरक्षित करा</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Reservation Bottom Sheet */}
      <BottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title={selectedStorage?.name}
        subtitle={`उपलब्ध जागा: ${selectedStorage?.availableTons} टन • दर: ₹${selectedStorage?.pricePerTonMonth}/टन/महिना`}
      >
        {selectedStorage && (
          <View style={styles.sheetContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>साठवणूक क्षमता (टन मध्ये):</Text>
              <View style={styles.numberRow}>
                {[5, 10, 20, 50].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.tonChip, tonsRequested === t && styles.tonChipActive]}
                    onPress={() => setTonsRequested(t)}
                  >
                    <Text
                      style={[
                        styles.tonChipText,
                        tonsRequested === t && styles.tonChipTextActive,
                      ]}
                    >
                      {t} टन
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>कालावधी (महिने):</Text>
              <View style={styles.numberRow}>
                {[1, 2, 3, 6].map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.tonChip, monthsCount === m && styles.tonChipActive]}
                    onPress={() => setMonthsCount(m)}
                  >
                    <Text
                      style={[
                        styles.tonChipText,
                        monthsCount === m && styles.tonChipTextActive,
                      ]}
                    >
                      {m} महिने
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.estimateCard}>
              <Text style={styles.estimateLabel}>अंदाजे एकूण भाडे रक्कम:</Text>
              <Text style={styles.estimateVal}>₹{calculateEstimate()}</Text>
              <Text style={styles.estimateSub}>
                ({tonsRequested} टन × {monthsCount} महिने × ₹{selectedStorage.pricePerTonMonth})
              </Text>
            </View>

            <PrimaryButton
              title="जागा निश्चित करा"
              icon="checkmark-done"
              onPress={handleConfirmReservation}
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
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
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
  filterRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceMuted,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.textInverse,
  },
  listContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xxl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  cardMainInfo: {
    flex: 1,
  },
  name: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  location: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  specStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  specBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.md,
    marginRight: 6,
    marginBottom: 4,
  },
  specText: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginLeft: 3,
    fontWeight: Typography.weights.medium,
  },
  cropsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  cropsLabel: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
  },
  cropName: {
    fontSize: 11,
    color: Colors.primaryDark,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.md,
  },
  priceSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  price: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.heavy,
    color: Colors.primary,
  },
  priceUnit: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  reserveBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radii.xl,
    ...Shadows.subtle,
  },
  reserveBtnText: {
    color: Colors.textInverse,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
  },
  sheetContent: {
    paddingBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  numberRow: {
    flexDirection: 'row',
  },
  tonChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  tonChipActive: {
    backgroundColor: Colors.mintTint,
    borderColor: Colors.primary,
  },
  tonChipText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  tonChipTextActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  estimateCard: {
    backgroundColor: Colors.mintTint,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.mintBorder,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  estimateLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  estimateVal: {
    fontSize: Typography.sizes.headline,
    fontWeight: Typography.weights.heavy,
    color: Colors.primary,
    marginTop: 2,
  },
  estimateSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
