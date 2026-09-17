// KRUSHI-SOOTRA (कृषी-सूत्र / कृषि-सूत्र)
// Skilled Farm Labour & Mukadam Teams Marketplace Screen (100% Pure Multilingual)

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
import SegmentedControl from '../components/ui/SegmentedControl';
import StatusBadge from '../components/ui/StatusBadge';
import BottomSheet from '../components/ui/BottomSheet';
import PrimaryButton from '../components/ui/PrimaryButton';
import GlassPressable from '../components/ui/GlassPressable';

const INDIVIDUAL_LABOUR_DATA = [
  {
    id: 'lab_1',
    name: { mr: 'ज्ञानेश्वर मोरे', hi: 'ज्ञानेश्वर मोरे', en: 'Dnyaneshwar More' },
    skills: {
      mr: ['कीटकनाशक फवारणी', 'खत व्यवस्थापन', 'ठिबक दुरुस्ती'],
      hi: ['कीटनाशक छिड़काव', 'खाद प्रबंधन', 'ड्रिप मरम्मत'],
      en: ['Pesticide Spraying', 'Fertilizer Management', 'Drip Repair'],
    },
    experienceYears: 8,
    dailyRate: 450,
    village: { mr: 'हवेली, पुणे', hi: 'हवेली, पुणे', en: 'Haveli, Pune' },
    phone: '+91 98231 11222',
    available: true,
  },
  {
    id: 'lab_2',
    name: { mr: 'सुनीताबाई गायकवाड', hi: 'सुनीताबाई गायकवाड़', en: 'Sunitabai Gaikwad' },
    skills: {
      mr: ['कांदा लागवड', 'खुरपणी', 'सोयाबीन काढणी'],
      hi: ['प्याज रोपाई', 'निराई-गुड़ाई', 'सोयाबीन कटाई'],
      en: ['Onion Plantation', 'Weeding Operations', 'Soybean Harvesting'],
    },
    experienceYears: 12,
    dailyRate: 400,
    village: { mr: 'मांजरी, पुणे', hi: 'मांजरी, पुणे', en: 'Manjari, Pune' },
    phone: '+91 98232 22333',
    available: true,
  },
  {
    id: 'lab_3',
    name: { mr: 'पंढरीनाथ शिंदे', hi: 'पंढरीनाथ शिंदे', en: 'Pandharinath Shinde' },
    skills: {
      mr: ['द्राक्ष बाग छाटणी', 'बांडिंग', 'फळबाग निगा'],
      hi: ['अंगूर बाग छंटाई', 'बांडिंग', 'फलोद्यान देखभाल'],
      en: ['Grape Pruning', 'Vine Banding', 'Orchard Maintenance'],
    },
    experienceYears: 15,
    dailyRate: 600,
    village: { mr: 'उरुळी कांचन, पुणे', hi: 'उरुली कंचन, पुणे', en: 'Uruli Kanchan, Pune' },
    phone: '+91 98233 33444',
    available: true,
  },
];

const MUKADAM_TEAMS_DATA = [
  {
    id: 'team_1',
    leaderName: { mr: 'मुकादम बाबुराव थोरात', hi: 'मुकादम बाबूराव थोरात', en: 'Leader Baburao Thorat' },
    teamSize: 15,
    skills: {
      mr: ['ऊस तोडणी व वाहतूक', 'गहू-हरभरा सोंगणी', 'कांदा काढणी'],
      hi: ['गन्ना कटाई व ढुलाई', 'गेहूं-चना कटाई', 'प्याज खुदाई'],
      en: ['Sugarcane Harvesting', 'Wheat-Gram Reaping', 'Onion Harvesting'],
    },
    dailyRatePerWorker: 420,
    village: { mr: 'दौंड परिसर', hi: 'दौंड क्षेत्र', en: 'Daund Region' },
    phone: '+91 94220 55667',
    available: true,
  },
  {
    id: 'team_2',
    leaderName: { mr: 'मुकादम मंगलताई कांबळे (महिला गट)', hi: 'मुकादम मंगलताई कांबले (महिला समूह)', en: 'Leader Mangaltai Kamble (Women Team)' },
    teamSize: 12,
    skills: {
      mr: ['भाजीपाला तोडणी', 'खुरपणी व स्वच्छता', 'रोपांची पुनर्लागवड'],
      hi: ['सब्जी तुड़ाई', 'निराई और सफाई', 'पौध रोपाई'],
      en: ['Vegetable Picking', 'Weeding & Cleaning', 'Sapling Transplantation'],
    },
    dailyRatePerWorker: 380,
    village: { mr: 'शिरूर, पुणे', hi: 'शिरूर, पुणे', en: 'Shirur, Pune' },
    phone: '+91 94220 77889',
    available: true,
  },
];

const LABOUR_TEXTS = {
  mr: {
    title: 'शेतमजूर व मुकादम टोळी केंद्र',
    subtitle: 'अनुभवी मजूर व कामगार टोळ्यांची थेट बुकिंग',
    tabIndividual: 'कुशल मजूर',
    tabTeams: 'मजूर टोळी व मुकादम',
    searchPlaceholderIndividual: 'कौशल्य शोधा (उदा. खुरपणी, फवारणी, छाटणी)...',
    searchPlaceholderTeams: 'मुकादम किंवा कामाचा प्रकार शोधा...',
    yearsExperience: 'वर्षे अनुभव',
    workersTeam: 'मजुरांची टोळी',
    available: 'उपलब्ध',
    busy: 'व्यस्त',
    activeTeam: 'सक्रिय टोळी',
    dailyWage: 'दैनिक मजुरी दर:',
    perDay: '/दिवस',
    ratePerWorker: 'दर प्रति मजूर:',
    perWorkerDay: '/मजूर/दिवस',
    callAction: 'थेट संपर्क',
    bookAction: 'बुकिंग करा',
    bookTeamAction: 'टोळी बुक करा',
    workersNeeded: 'आवश्यक मजुरांची संख्या:',
    workDays: 'कामाचे दिवस:',
    estCost: 'अंदाजे मजुरी रक्कम:',
    workPaymentNote: '* काम पूर्ण झाल्यावर मजुरांना थेट हिशोबाने मोबदला द्या.',
    confirmBooking: 'बुकिंग निश्चित करा',
    bookingSuccess: 'मजूर बुकिंग निश्चित!',
  },
  hi: {
    title: 'खेत मजदूर और मुकादम टोली केंद्र',
    subtitle: 'अनुभवी कृषि श्रमिक और मजदूर टोलियों की सीधी बुकिंग',
    tabIndividual: 'कुशल मजदूर',
    tabTeams: 'मजदूर टोली और मुकादम',
    searchPlaceholderIndividual: 'कौशल खोजें (जैसे निराई, छिड़काव, छंटाई)...',
    searchPlaceholderTeams: 'मुकादम या कार्य का प्रकार खोजें...',
    yearsExperience: 'वर्ष अनुभव',
    workersTeam: 'मजदूरों की टोली',
    available: 'उपलब्ध',
    busy: 'व्यस्त',
    activeTeam: 'सक्रिय टोली',
    dailyWage: 'दैनिक मजदूरी दर:',
    perDay: '/दिन',
    ratePerWorker: 'दर प्रति श्रमिक:',
    perWorkerDay: '/श्रमिक/दिन',
    callAction: 'सीधा संपर्क',
    bookAction: 'बुकिंग करें',
    bookTeamAction: 'टोली बुक करें',
    workersNeeded: 'आवश्यक श्रमिकों की संख्या:',
    workDays: 'कार्य दिवस:',
    estCost: 'अनुमानित मजदूरी राशि:',
    workPaymentNote: '* कार्य पूर्ण होने पर श्रमिकों को सीधे भुगतान करें।',
    confirmBooking: 'बुकिंग पक्की करें',
    bookingSuccess: 'मजदूर बुकिंग पक्की हुई!',
  },
  en: {
    title: 'Farm Labour & Contractor Hub',
    subtitle: 'Direct booking for skilled agricultural workers and harvesting teams',
    tabIndividual: 'Skilled Labour',
    tabTeams: 'Labour Teams & Leaders',
    searchPlaceholderIndividual: 'Search skills (e.g., weeding, spraying, pruning)...',
    searchPlaceholderTeams: 'Search leader or task type...',
    yearsExperience: 'years experience',
    workersTeam: 'workers team',
    available: 'Available',
    busy: 'Busy',
    activeTeam: 'Active Team',
    dailyWage: 'Daily Wage Rate:',
    perDay: '/day',
    ratePerWorker: 'Rate per Worker:',
    perWorkerDay: '/worker/day',
    callAction: 'Direct Call',
    bookAction: 'Book Worker',
    bookTeamAction: 'Book Team',
    workersNeeded: 'Workers Needed:',
    workDays: 'Working Days:',
    estCost: 'Estimated Total Wages:',
    workPaymentNote: '* Pay workers directly upon satisfactory completion of field work.',
    confirmBooking: 'Confirm Reservation',
    bookingSuccess: 'Worker Booking Confirmed!',
  },
};

export default function LabourScreen({ language = 'mr', onBookingConfirmed }) {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [bookingSheetVisible, setBookingSheetVisible] = useState(false);
  const [daysCount, setDaysCount] = useState(1);
  const [workersNeeded, setWorkersNeeded] = useState(5);

  const t = LABOUR_TEXTS[language] || LABOUR_TEXTS.mr;
  const isIndividual = activeSegmentIndex === 0;

  const openBooking = (item) => {
    setSelectedLabour(item);
    setDaysCount(1);
    setWorkersNeeded(item.teamSize ? Math.min(item.teamSize, 5) : 1);
    setBookingSheetVisible(true);
  };

  const calculateCost = () => {
    if (!selectedLabour) return { base: 0, total: 0 };
    if (isIndividual) {
      const base = selectedLabour.dailyRate * daysCount;
      return { base, total: base };
    } else {
      const base = selectedLabour.dailyRatePerWorker * workersNeeded * daysCount;
      return { base, total: base };
    }
  };

  const handleConfirmBooking = () => {
    const cost = calculateCost();
    const isTeam = !isIndividual;
    const name = isTeam
      ? selectedLabour.leaderName[language] || selectedLabour.leaderName.mr
      : selectedLabour.name[language] || selectedLabour.name.mr;

    const newBooking = {
      id: `LB-${Date.now().toString().slice(-6)}`,
      resourceType: 'labour',
      resourceName: `${name} (${isTeam ? `${workersNeeded}` : '1'})`,
      providerName: name,
      totalAmount: cost.total,
      date: new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'mr-IN'),
      status: 'Confirmed',
    };

    setBookingSheetVisible(false);
    if (onBookingConfirmed) {
      onBookingConfirmed(newBooking);
    }

    Alert.alert(
      t.bookingSuccess,
      `${name}\n${t.estCost} ₹${cost.total}\n${selectedLabour.phone}`
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        <SegmentedControl
          segments={[
            { label: t.tabIndividual },
            { label: t.tabTeams },
          ]}
          selectedIndex={activeSegmentIndex}
          onChange={(idx) => setActiveSegmentIndex(idx)}
        />

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={isIndividual ? t.searchPlaceholderIndividual : t.searchPlaceholderTeams}
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {isIndividual ? (
          INDIVIDUAL_LABOUR_DATA.map((lab) => {
            const labName = lab.name[language] || lab.name.mr;
            const labVillage = lab.village[language] || lab.village.mr;
            const labSkills = lab.skills[language] || lab.skills.mr;

            return (
              <View key={lab.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.headerText}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name} numberOfLines={1}>{labName}</Text>
                      <Ionicons
                        name="checkmark-circle"
                        size={15}
                        color={Colors.primaryLight}
                        style={{ marginLeft: 4 }}
                      />
                    </View>
                    <Text style={styles.villageText} numberOfLines={1}>
                      📍 {labVillage} • {lab.experienceYears} {t.yearsExperience}
                    </Text>
                  </View>
                  <StatusBadge
                    label={lab.available ? t.available : t.busy}
                    status={lab.available ? 'success' : 'warning'}
                    size="small"
                  />
                </View>

                {/* Skills */}
                <View style={styles.skillsWrapper}>
                  {labSkills.map((skill, idx) => (
                    <View key={idx} style={styles.skillPill}>
                      <Text style={styles.skillPillText}>{skill}</Text>
                    </View>
                  ))}
                </View>

                {/* Footer */}
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.rateLabel}>{t.dailyWage}</Text>
                    <Text style={styles.rateValue}>
                      ₹{lab.dailyRate}
                      <Text style={styles.rateUnit}> {t.perDay}</Text>
                    </Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <GlassPressable
                      style={styles.callBtn}
                      onPress={() => Alert.alert(t.callAction, `${labName}: ${lab.phone}`)}
                      hapticType="selection"
                    >
                      <Ionicons name="call" size={18} color={Colors.primary} />
                    </GlassPressable>

                    <GlassPressable
                      style={styles.bookBtn}
                      onPress={() => openBooking(lab)}
                      hapticType="medium"
                    >
                      <Text style={styles.bookBtnText}>{t.bookAction}</Text>
                    </GlassPressable>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          MUKADAM_TEAMS_DATA.map((team) => {
            const leaderName = team.leaderName[language] || team.leaderName.mr;
            const teamVillage = team.village[language] || team.village.mr;
            const teamSkills = team.skills[language] || team.skills.mr;

            return (
              <View key={team.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.avatar, { backgroundColor: '#E0F2FE' }]}>
                    <Ionicons name="people" size={24} color={Colors.info} />
                  </View>
                  <View style={styles.headerText}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name} numberOfLines={1}>{leaderName}</Text>
                    </View>
                    <Text style={styles.villageText} numberOfLines={1}>
                      📍 {teamVillage} • {team.teamSize} {t.workersTeam}
                    </Text>
                  </View>
                  <StatusBadge
                    label={team.available ? t.activeTeam : t.busy}
                    status={team.available ? 'success' : 'neutral'}
                    size="small"
                  />
                </View>

                {/* Team Skills */}
                <View style={styles.skillsWrapper}>
                  {teamSkills.map((skill, idx) => (
                    <View key={idx} style={[styles.skillPill, { backgroundColor: '#E0F2FE', borderColor: '#BAE6FD' }]}>
                      <Text style={[styles.skillPillText, { color: Colors.info }]}>{skill}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.rateLabel}>{t.ratePerWorker}</Text>
                    <Text style={styles.rateValue}>
                      ₹{team.dailyRatePerWorker}
                      <Text style={styles.rateUnit}> {t.perWorkerDay}</Text>
                    </Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <GlassPressable
                      style={styles.callBtn}
                      onPress={() => Alert.alert(t.callAction, `${leaderName}: ${team.phone}`)}
                      hapticType="selection"
                    >
                      <Ionicons name="call" size={18} color={Colors.primary} />
                    </GlassPressable>

                    <GlassPressable
                      style={styles.bookBtn}
                      onPress={() => openBooking(team)}
                      hapticType="medium"
                    >
                      <Text style={styles.bookBtnText}>{t.bookTeamAction}</Text>
                    </GlassPressable>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Booking Sheet */}
      <BottomSheet
        visible={bookingSheetVisible}
        onClose={() => setBookingSheetVisible(false)}
        title={
          selectedLabour
            ? isIndividual
              ? selectedLabour.name[language] || selectedLabour.name.mr
              : selectedLabour.leaderName[language] || selectedLabour.leaderName.mr
            : ''
        }
        subtitle={
          selectedLabour
            ? isIndividual
              ? `₹${selectedLabour.dailyRate} ${t.perDay}`
              : `${selectedLabour.teamSize} ${t.workersTeam}`
            : ''
        }
      >
        {selectedLabour && (
          <View style={styles.sheetBody}>
            {!isIndividual && (
              <View style={styles.counterRow}>
                <Text style={styles.counterLabel}>{t.workersNeeded}</Text>
                <View style={styles.counterControls}>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => {
                      if (workersNeeded > 1) setWorkersNeeded(workersNeeded - 1);
                    }}
                  >
                    <Text style={styles.counterBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterVal}>{workersNeeded}</Text>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => {
                      if (workersNeeded < selectedLabour.teamSize) {
                        setWorkersNeeded(workersNeeded + 1);
                      }
                    }}
                  >
                    <Text style={styles.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.counterRow}>
              <Text style={styles.counterLabel}>{t.workDays}</Text>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => {
                    if (daysCount > 1) setDaysCount(daysCount - 1);
                  }}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterVal}>{daysCount}</Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setDaysCount(daysCount + 1)}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.calcBox}>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>{t.estCost}</Text>
                <Text style={styles.calcVal}>₹{calculateCost().total}</Text>
              </View>
              <Text style={styles.calcSub}>{t.workPaymentNote}</Text>
            </View>

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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.sizes.body,
    color: Colors.textPrimary,
  },
  listContainer: {
    padding: Spacing.lg,
    paddingBottom: 110, // Dock avoidance
  },
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: Radii.xl,
    backgroundColor: Colors.mintTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
    marginRight: Spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  villageText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  skillPill: {
    backgroundColor: Colors.mintTint,
    borderRadius: Radii.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.mintBorder,
  },
  skillPillText: {
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
    color: Colors.primaryDark,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.sm,
  },
  rateLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: Typography.weights.heavy,
    color: Colors.primary,
  },
  rateUnit: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.lg,
    backgroundColor: Colors.mintTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.mintBorder,
  },
  bookBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radii.lg,
    ...Shadows.subtle,
  },
  bookBtnText: {
    color: Colors.textInverse,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
  },
  sheetBody: {
    paddingBottom: Spacing.md,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
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
  counterVal: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    marginHorizontal: Spacing.lg,
  },
  calcBox: {
    backgroundColor: Colors.mintTint,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.mintBorder,
    marginBottom: Spacing.md,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  calcVal: {
    fontSize: Typography.sizes.headline,
    fontWeight: Typography.weights.heavy,
    color: Colors.primary,
  },
  calcSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
