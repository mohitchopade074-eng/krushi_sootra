// KRUSHI-SOOTRA (कृषी-सूत्र / कृषि-सूत्र)
// Warehouse & Cold Storage Reservation Screen (100% Pure Multilingual)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
    name: {
      mr: 'सह्याद्री ॲग्रो शीतगृह व पॅकहाऊस',
      hi: 'सह्याद्री एग्रो कोल्ड स्टोरेज व पैकहाउस',
      en: 'Sahyadri Agro Cold Storage & Packhouse',
    },
    isColdStorage: true,
    tempRange: '-2°C to 4°C',
    capacityTons: 1500,
    availableTons: 420,
    pricePerTonMonth: 650,
    village: { mr: 'हवेली, पुणे', hi: 'हवेली, पुणे', en: 'Haveli, Pune' },
    ownerName: { mr: 'अशोकराव पवार', hi: 'अशोकराव पवार', en: 'Ashokrao Pawar' },
    phone: '+91 98224 88776',
    cctv: true,
    insured: true,
    suitableFor: {
      mr: ['द्राक्षे', 'डाळिंब', 'कांदा', 'भाजीपाला', 'सफरचंद'],
      hi: ['अंगूर', 'अनार', 'प्याज', 'सब्जियां', 'सेब'],
      en: ['Grapes', 'Pomegranates', 'Onions', 'Vegetables', 'Apples'],
    },
  },
  {
    id: 'wh_2',
    name: {
      mr: 'किसान समृद्धी धान्य व डाळ गोदाम',
      hi: 'किसान समृद्धि अनाज एवं दाल गोदाम',
      en: 'Kisan Samriddhi Grain & Pulses Warehouse',
    },
    isColdStorage: false,
    capacityTons: 3000,
    availableTons: 1100,
    pricePerTonMonth: 280,
    village: { mr: 'शिक्रापूर, पुणे', hi: 'शिक्रापुर, पुणे', en: 'Shikrapur, Pune' },
    ownerName: { mr: 'तानाजी जगताप', hi: 'तानाजी जगताप', en: 'Tanaji Jagtap' },
    phone: '+91 98225 33445',
    cctv: true,
    insured: true,
    suitableFor: {
      mr: ['सोयाबीन', 'गहू', 'हरभरा', 'तूर', 'मका'],
      hi: ['सोयाबीन', 'गेहूं', 'चना', 'अरहर', 'मक्का'],
      en: ['Soybeans', 'Wheat', 'Chickpeas', 'Pigeon Peas', 'Maize'],
    },
  },
  {
    id: 'wh_3',
    name: {
      mr: 'श्री गणेश आधुनिक कांदा चाळ',
      hi: 'श्री गणेश आधुनिक प्याज भंडारण गृह',
      en: 'Shree Ganesh Modern Onion Storage Facility',
    },
    isColdStorage: false,
    capacityTons: 800,
    availableTons: 250,
    pricePerTonMonth: 320,
    village: { mr: 'चाकण, पुणे', hi: 'चाकन, पुणे', en: 'Chakan, Pune' },
    ownerName: { mr: 'रमेश खेडकर', hi: 'रमेश खेडकर', en: 'Ramesh Khedkar' },
    phone: '+91 98226 55667',
    cctv: true,
    insured: false,
    suitableFor: {
      mr: ['लाल कांदा', 'उन्हाळी कांदा', 'लसूण'],
      hi: ['लाल प्याज', 'गर्मी का प्याज', 'लहसुन'],
      en: ['Red Onions', 'Summer Onions', 'Garlic'],
    },
  },
];

const WAREHOUSE_TEXTS = {
  mr: {
    title: 'गोदाम व शीतगृह साठवणूक',
    subtitle: 'हमीभाव मिळेपर्यंत धान्य व फळे सुरक्षित ठेवा',
    allStorage: 'सर्व साठवणूक',
    coldOnly: 'फक्त शीतगृह',
    spaceAvailable: 'टन मोकळे',
    cctvBadge: 'CCTV सुरक्षित',
    insuredBadge: 'विमा संरक्षित',
    suitableCrops: 'योग्य पिके: ',
    rateLabel: 'साठवणूक दर:',
    perTonMonth: '/टन/महिना',
    reserveBtn: 'जागा आरक्षित करा',
    capacityTonsLabel: 'साठवणूक क्षमता (टन मध्ये):',
    durationMonthsLabel: 'कालावधी (महिने):',
    tonsSuffix: 'टन',
    monthsSuffix: 'महिने',
    estRent: 'अंदाजे एकूण भाडे रक्कम:',
    confirmBtn: 'जागा निश्चित करा',
    successTitle: 'जागा आरक्षण निश्चित!',
    phoneContact: 'मालकाशी संपर्क:',
  },
  hi: {
    title: 'गोदाम और कोल्ड स्टोरेज भंडारण',
    subtitle: 'उचित मूल्य मिलने तक अनाज और फल सुरक्षित रखें',
    allStorage: 'सभी भंडारण',
    coldOnly: 'केवल कोल्ड स्टोरेज',
    spaceAvailable: 'टन रिक्त',
    cctvBadge: 'CCTV सुरक्षित',
    insuredBadge: 'बीमा सुरक्षित',
    suitableCrops: 'अनुकूल फसलें: ',
    rateLabel: 'भंडारण दर:',
    perTonMonth: '/टन/माह',
    reserveBtn: 'स्थान आरक्षित करें',
    capacityTonsLabel: 'भंडारण क्षमता (टन में):',
    durationMonthsLabel: 'अवधि (माह):',
    tonsSuffix: 'टन',
    monthsSuffix: 'माह',
    estRent: 'अनुमानित कुल किराया राशि:',
    confirmBtn: 'स्थान पक्का करें',
    successTitle: 'स्थान आरक्षण सफल!',
    phoneContact: 'मालिक से संपर्क:',
  },
  en: {
    title: 'Warehouse & Cold Storage Facilities',
    subtitle: 'Safeguard grains and fresh produce until optimal market price',
    allStorage: 'All Facilities',
    coldOnly: 'Cold Storage Only',
    spaceAvailable: 'tons available',
    cctvBadge: 'CCTV Secured',
    insuredBadge: 'Insured Facility',
    suitableCrops: 'Suitable Crops: ',
    rateLabel: 'Storage Rate:',
    perTonMonth: '/ton/month',
    reserveBtn: 'Reserve Space',
    capacityTonsLabel: 'Required Capacity (Tons):',
    durationMonthsLabel: 'Storage Duration (Months):',
    tonsSuffix: 'Tons',
    monthsSuffix: 'Months',
    estRent: 'Estimated Total Storage Rent:',
    confirmBtn: 'Confirm Reservation',
    successTitle: 'Space Reserved Successfully!',
    phoneContact: 'Facility Owner Contact:',
  },
};

export default function WarehouseScreen({ language = 'mr', onBookingConfirmed }) {
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [tonsRequested, setTonsRequested] = useState(10);
  const [monthsCount, setMonthsCount] = useState(2);
  const [onlyColdStorage, setOnlyColdStorage] = useState(false);

  const t = WAREHOUSE_TEXTS[language] || WAREHOUSE_TEXTS.mr;

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
    const storageName = selectedStorage.name[language] || selectedStorage.name.mr;
    const owner = selectedStorage.ownerName[language] || selectedStorage.ownerName.mr;

    const newBooking = {
      id: `WH-${Date.now().toString().slice(-6)}`,
      resourceType: 'warehouse',
      resourceName: `${storageName} (${tonsRequested} ${t.tonsSuffix} / ${monthsCount} ${t.monthsSuffix})`,
      providerName: owner,
      totalAmount: total,
      date: new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'mr-IN'),
      status: 'Confirmed',
    };

    setSheetVisible(false);
    if (onBookingConfirmed) {
      onBookingConfirmed(newBooking);
    }

    Alert.alert(
      t.successTitle,
      `${storageName}\n${t.estRent} ₹${total}\n${t.phoneContact} ${selectedStorage.phone}`
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

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
              {t.allStorage} ({WAREHOUSE_DATA.length})
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
              {t.coldOnly}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {displayedList.map((item) => {
          const name = item.name[language] || item.name.mr;
          const village = item.village[language] || item.village.mr;
          const suitableCrops = item.suitableFor[language] || item.suitableFor.mr;

          return (
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
                  <Text style={styles.name}>{name}</Text>
                  <Text style={styles.location}>📍 {village}</Text>
                </View>

                <StatusBadge
                  label={`${item.availableTons} ${t.spaceAvailable}`}
                  status="success"
                  size="small"
                />
              </View>

              {/* Badges strip */}
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
                    <Text style={styles.specText}>{t.cctvBadge}</Text>
                  </View>
                )}
                {item.insured && (
                  <View style={styles.specBadge}>
                    <Ionicons name="shield-checkmark-outline" size={13} color="#B45309" />
                    <Text style={styles.specText}>{t.insuredBadge}</Text>
                  </View>
                )}
              </View>

              {/* Suitable crops */}
              <View style={styles.cropsRow}>
                <Text style={styles.cropsLabel}>{t.suitableCrops}</Text>
                {suitableCrops.map((crop, idx) => (
                  <Text key={idx} style={styles.cropName}>
                    {crop}
                    {idx < suitableCrops.length - 1 ? ', ' : ''}
                  </Text>
                ))}
              </View>

              {/* Pricing and Action */}
              <View style={styles.footerRow}>
                <View>
                  <Text style={styles.priceSub}>{t.rateLabel}</Text>
                  <Text style={styles.price}>
                    ₹{item.pricePerTonMonth}
                    <Text style={styles.priceUnit}> {t.perTonMonth}</Text>
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.reserveBtn}
                  onPress={() => openReserve(item)}
                >
                  <Text style={styles.reserveBtnText}>{t.reserveBtn}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Reservation Bottom Sheet */}
      <BottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title={selectedStorage ? (selectedStorage.name[language] || selectedStorage.name.mr) : ''}
        subtitle={selectedStorage ? `${selectedStorage.availableTons} ${t.spaceAvailable} • ₹${selectedStorage.pricePerTonMonth}${t.perTonMonth}` : ''}
      >
        {selectedStorage && (
          <View style={styles.sheetContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.capacityTonsLabel}</Text>
              <View style={styles.numberRow}>
                {[5, 10, 20, 50].map((tons) => (
                  <TouchableOpacity
                    key={tons}
                    style={[styles.tonChip, tonsRequested === tons && styles.tonChipActive]}
                    onPress={() => setTonsRequested(tons)}
                  >
                    <Text
                      style={[
                        styles.tonChipText,
                        tonsRequested === tons && styles.tonChipTextActive,
                      ]}
                    >
                      {tons} {t.tonsSuffix}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.durationMonthsLabel}</Text>
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
                      {m} {t.monthsSuffix}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.estimateCard}>
              <Text style={styles.estimateLabel}>{t.estRent}</Text>
              <Text style={styles.estimateVal}>₹{calculateEstimate()}</Text>
              <Text style={styles.estimateSub}>
                ({tonsRequested} {t.tonsSuffix} × {monthsCount} {t.monthsSuffix} × ₹{selectedStorage.pricePerTonMonth})
              </Text>
            </View>

            <PrimaryButton
              title={t.confirmBtn}
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
