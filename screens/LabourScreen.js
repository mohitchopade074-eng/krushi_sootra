// KRUSHI-SOOTRA (कृषी-सूत्र)
// Skilled Farm Labour & Mukadam Teams Marketplace Screen

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

const INDIVIDUAL_LABOUR = [
  {
    id: 'lab_1',
    name: 'ज्ञानेश्वर मोरे',
    skills: ['कीटकनाशक फवारणी', 'खत व्यवस्थापन', 'ठिबक दुरुस्ती'],
    experienceYears: 8,
    dailyRate: 450,
    halfDayRate: 250,
    village: 'हवेली, पुणे',
    rating: 4.9,
    reviews: 24,
    phone: '+91 98231 11222',
    available: true,
  },
  {
    id: 'lab_2',
    name: 'सुनीताबाई गायकवाड',
    skills: ['कांदा लागवड', 'खुरपणी', 'सोयाबीन काढणी'],
    experienceYears: 12,
    dailyRate: 400,
    halfDayRate: 220,
    village: 'मांजरी, पुणे',
    rating: 5.0,
    reviews: 31,
    phone: '+91 98232 22333',
    available: true,
  },
  {
    id: 'lab_3',
    name: 'पंढरीनाथ शिंदे',
    skills: ['द्राक्ष बाग छाटणी', 'बांडिंग', 'फळबाग निगा'],
    experienceYears: 15,
    dailyRate: 600,
    halfDayRate: 350,
    village: 'उरुळी कांचन, पुणे',
    rating: 4.8,
    reviews: 19,
    phone: '+91 98233 33444',
    available: true,
  },
];

const MUKADAM_TEAMS = [
  {
    id: 'team_1',
    leaderName: 'मुकादम बाबुराव थोरात',
    teamSize: 15,
    skills: ['ऊस तोडणी व वाहतूक', 'गहू-हरभरा सोंगणी', 'कांदा काढणी'],
    dailyRatePerWorker: 420,
    village: 'दौंड - हवेली परिसर',
    rating: 4.9,
    completedJobs: 42,
    phone: '+91 94220 55667',
    available: true,
  },
  {
    id: 'team_2',
    leaderName: 'मुकादम मंगलताई कांबळे (महिला टोळी)',
    teamSize: 12,
    skills: ['भाजीपाला तोडणी', 'खुरपणी व स्वच्छता', 'रोपांची पुनर्लागवड'],
    dailyRatePerWorker: 380,
    village: 'शिरूर - पुणे',
    rating: 5.0,
    completedJobs: 58,
    phone: '+91 94220 77889',
    available: true,
  },
  {
    id: 'team_3',
    leaderName: 'मुकादम रामदास काळे',
    teamSize: 20,
    skills: ['डाळिंब व द्राक्ष तोडणी', 'क्रिएटिंग व पॅकिंग', 'जमीन मशागत'],
    dailyRatePerWorker: 450,
    village: 'इंदापूर - बारामती',
    rating: 4.8,
    completedJobs: 37,
    phone: '+91 94220 99001',
    available: false,
  },
];

export default function LabourScreen({ language = 'mr', onBookingConfirmed }) {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0); // 0: Individual, 1: Teams
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [bookingSheetVisible, setBookingSheetVisible] = useState(false);
  const [daysCount, setDaysCount] = useState(1);
  const [workersNeeded, setWorkersNeeded] = useState(5);

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
    const name = isTeam ? selectedLabour.leaderName : selectedLabour.name;

    const newBooking = {
      id: `LB-${Date.now().toString().slice(-6)}`,
      resourceType: 'labour',
      resourceName: `${name} (${isTeam ? `${workersNeeded} मजूर` : 'वैयक्तिक'})`,
      providerName: name,
      totalAmount: cost.total,
      date: new Date().toLocaleDateString('mr-IN'),
      status: 'Confirmed',
    };

    setBookingSheetVisible(false);
    if (onBookingConfirmed) {
      onBookingConfirmed(newBooking);
    }

    Alert.alert(
      'मजूर बुकिंग निश्चित!',
      `${name} यांच्यासोबत समन्वय साधला गेला आहे.\nएकूण अंदाजे मजुरी: ₹${cost.total}\nसंपर्क: ${selectedLabour.phone}`
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Title & Search */}
      <View style={styles.header}>
        <Text style={styles.title}>शेतमजूर व मुकादम टोळी केंद्र</Text>
        <Text style={styles.subtitle}>
          अनुभवी मजूर व कामगार टोळ्यांची थेट बुकिंग
        </Text>

        <SegmentedControl
          segments={[
            { label: 'वैयक्तिक कुशल मजूर (Individual)' },
            { label: 'मजूर टोळी / मुकादम (Teams)' },
          ]}
          selectedIndex={activeSegmentIndex}
          onChange={(idx) => setActiveSegmentIndex(idx)}
        />

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={
              isIndividual
                ? 'कौशल्य शोधा (उदा. खुरपणी, फवारणी, छाटणी)...'
                : 'मुकादम किंवा कामाचा प्रकार शोधा...'
            }
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
          /* Individual Labour Cards */
          INDIVIDUAL_LABOUR.map((lab) => (
            <View key={lab.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={24} color={Colors.primary} />
                </View>
                <View style={styles.headerText}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{lab.name}</Text>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={Colors.primaryLight}
                      style={{ marginLeft: 4 }}
                    />
                  </View>
                  <Text style={styles.villageText}>
                    📍 {lab.village} • {lab.experienceYears} वर्षे अनुभव
                  </Text>
                </View>
                <StatusBadge
                  label={lab.available ? 'उपलब्ध' : 'व्यस्त'}
                  status={lab.available ? 'success' : 'warning'}
                  size="small"
                />
              </View>

              {/* Skills Chips */}
              <View style={styles.skillsWrapper}>
                {lab.skills.map((skill, idx) => (
                  <View key={idx} style={styles.skillPill}>
                    <Text style={styles.skillPillText}>{skill}</Text>
                  </View>
                ))}
              </View>

              {/* Footer Rates & Action */}
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.rateLabel}>दैनिक मजुरी दर:</Text>
                  <Text style={styles.rateValue}>
                    ₹{lab.dailyRate}
                    <Text style={styles.rateUnit}> /दिवस</Text>
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() =>
                      Alert.alert('थेट संपर्क', `${lab.name}: ${lab.phone}`)
                    }
                  >
                    <Ionicons name="call" size={18} color={Colors.primary} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => openBooking(lab)}
                  >
                    <Text style={styles.bookBtnText}>बुकिंग करा</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          /* Mukadam Team Cards */
          MUKADAM_TEAMS.map((team) => (
            <View key={team.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="people" size={24} color={Colors.info} />
                </View>
                <View style={styles.headerText}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{team.leaderName}</Text>
                  </View>
                  <Text style={styles.villageText}>
                    📍 {team.village} • {team.teamSize} मजुरांची टोळी
                  </Text>
                </View>
                <StatusBadge
                  label={team.available ? 'सक्रिय टोळी' : 'व्यस्त'}
                  status={team.available ? 'success' : 'neutral'}
                  size="small"
                />
              </View>

              {/* Team Skills */}
              <View style={styles.skillsWrapper}>
                {team.skills.map((skill, idx) => (
                  <View key={idx} style={[styles.skillPill, { backgroundColor: '#E0F2FE', borderColor: '#BAE6FD' }]}>
                    <Text style={[styles.skillPillText, { color: Colors.info }]}>{skill}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.rateLabel}>दर प्रति मजूर:</Text>
                  <Text style={styles.rateValue}>
                    ₹{team.dailyRatePerWorker}
                    <Text style={styles.rateUnit}> /मजूर/दिवस</Text>
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() =>
                      Alert.alert('थेट संपर्क', `${team.leaderName}: ${team.phone}`)
                    }
                  >
                    <Ionicons name="call" size={18} color={Colors.primary} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => openBooking(team)}
                  >
                    <Text style={styles.bookBtnText}>टोळी बुक करा</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Booking Sheet Modal */}
      <BottomSheet
        visible={bookingSheetVisible}
        onClose={() => setBookingSheetVisible(false)}
        title={isIndividual ? selectedLabour?.name : selectedLabour?.leaderName}
        subtitle={isIndividual ? `दैनिक मजुरी ₹${selectedLabour?.dailyRate}` : `${selectedLabour?.teamSize} मजुरांची टोळी`}
      >
        {selectedLabour && (
          <View style={styles.sheetBody}>
            {!isIndividual && (
              <View style={styles.counterRow}>
                <Text style={styles.counterLabel}>आवश्यक मजुरांची संख्या:</Text>
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
              <Text style={styles.counterLabel}>कामाचे दिवस:</Text>
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
                <Text style={styles.calcLabel}>अंदाजे मजुरी रक्कम:</Text>
                <Text style={styles.calcVal}>₹{calculateCost().total}</Text>
              </View>
              <Text style={styles.calcSub}>
                * काम पूर्ण झाल्यावर मजुरांना थेट हिशोबाने मोबदला द्या.
              </Text>
            </View>

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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radii.xl,
    backgroundColor: Colors.mintTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: Typography.sizes.subtitle,
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
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  skillPill: {
    backgroundColor: Colors.mintTint,
    borderRadius: Radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
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
    paddingTop: Spacing.md,
  },
  rateLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  rateValue: {
    fontSize: Typography.sizes.title,
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
    width: 42,
    height: 42,
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radii.xl,
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
