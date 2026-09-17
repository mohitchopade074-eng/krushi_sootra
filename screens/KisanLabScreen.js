// KRUSHI-SOOTRA (कृषी-सूत्र)
// Kisan Lab: Soil Health Card OCR & Crop Disease Diagnostics

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing, Typography } from '../constants/theme';
import SegmentedControl from '../components/ui/SegmentedControl';
import PrimaryButton from '../components/ui/PrimaryButton';

export default function KisanLabScreen() {
  const [activeTab, setActiveTab] = useState(0); // 0: Soil OCR, 1: Crop Disease
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Simulated OCR Soil Report Data
  const [soilReport, setSoilReport] = useState({
    nitrogen: { value: 185, unit: 'kg/ha', status: 'कमी (Low)', color: '#EF4444' },
    phosphorus: { value: 24, unit: 'kg/ha', status: 'मध्यम (Medium)', color: '#F59E0B' },
    potassium: { value: 310, unit: 'kg/ha', status: 'योग्य (High)', color: '#10B981' },
    ph: { value: 7.2, unit: '', status: 'सर्वसाधारण (Ideal)', color: '#10B981' },
    organicCarbon: { value: 0.42, unit: '%', status: 'कमी (Deficient)', color: '#EF4444' },
    advisory:
      'मातीमध्ये नत्र (Nitrogen) व सेंद्रिय कर्बाचे प्रमाण कमी आहे. पेरणीपूर्वी प्रति एकरी २ ट्रॉली चांगले कुजलेले शेणखत किंवा गांडूळखत द्या. नत्राच्या कमतरतेसाठी युरियाची शिफारस केलेली मात्रा दोन हप्त्यांत विभागून द्या.',
  });

  // Simulated Crop Disease Data
  const [selectedCrop, setSelectedCrop] = useState('onion');
  const [cropDiagnostic, setCropDiagnostic] = useState({
    cropName: 'कांदा (Onion)',
    diseaseName: 'जांभळा करपा (Purple Blotch)',
    confidence: 96,
    symptoms: 'पानांवर पांढरट-राखाडी ठिपके पडून त्यांचे रूपांतर जांभळट तपकिरी डागांमध्ये होते. पाने वाळू लागतात.',
    organicRemedy: '५ मिली निंबोळी तेल (१०,००० PPM) + ट्रायकोडर्मा ५ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारणी करा.',
    chemicalRemedy: 'मॅन्कोझेब (Mancozeb 75% WP) ३० ग्रॅम किंवा टेब्युकोनाझोल (Tebuconazole) १५ मिली प्रति १५ लिटर पंपासाठी फवारा.',
  });

  const handleStartScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
      Alert.alert(
        'स्कॅन यशस्वी!',
        activeTab === 0
          ? 'माती आरोग्य पत्रिकेतील N-P-K पोषणद्रव्यांचे यशस्वी वाचन झाले आहे.'
          : 'पानावरील रोग निदानाचे अचूक विश्लेषण पूर्ण झाले आहे.'
      );
    }, 1600);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>किसान लॅब व निदान केंद्र</Text>
        <Text style={styles.subtitle}>
          माती परीक्षण OCR आणि पानांच्या रोगांचे झटपट निदान
        </Text>

        <SegmentedControl
          segments={[
            { label: 'माती आरोग्य पत्रिका OCR' },
            { label: 'पीक रोग व कीड निदान' },
          ]}
          selectedIndex={activeTab}
          onChange={(idx) => {
            setActiveTab(idx);
            setScanComplete(false);
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 0 ? (
          /* Soil Health Card OCR Section */
          <View>
            <View style={styles.scanBox}>
              <View style={styles.scanIconWrapper}>
                <Ionicons name="document-text-outline" size={48} color="#B45309" />
              </View>
              <Text style={styles.scanBoxTitle}>
                माती आरोग्य पत्रिका (Soil Card) स्कॅन करा
              </Text>
              <Text style={styles.scanBoxDesc}>
                शासकीय किंवा खाजगी लॅबच्या माती पत्रिकेचा स्पष्ट फोटो काढा. आमचे Tesseract OCR इंजिन आपोआप पोषण मूल्ये वाचेल.
              </Text>

              <PrimaryButton
                title={scanning ? 'OCR विश्लेषण सुरू आहे...' : 'कॅमेऱ्याने स्कॅन करा'}
                icon="camera"
                onPress={handleStartScan}
                loading={scanning}
                style={styles.scanActionBtn}
              />
            </View>

            {/* Results Section */}
            <View style={styles.resultsCard}>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>N-P-K पोषणद्रव्य अहवाल</Text>
                <View style={styles.ocrBadge}>
                  <Text style={styles.ocrBadgeText}>Tesseract OCR</Text>
                </View>
              </View>

              <View style={styles.nutrientsGrid}>
                {/* Nitrogen */}
                <View style={styles.nutrientBox}>
                  <Text style={styles.nutrientLabel}>नत्र (N)</Text>
                  <Text style={styles.nutrientVal}>{soilReport.nitrogen.value}</Text>
                  <Text style={styles.nutrientUnit}>{soilReport.nitrogen.unit}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: `${soilReport.nitrogen.color}20` },
                    ]}
                  >
                    <Text
                      style={[styles.statusPillText, { color: soilReport.nitrogen.color }]}
                    >
                      {soilReport.nitrogen.status}
                    </Text>
                  </View>
                </View>

                {/* Phosphorus */}
                <View style={styles.nutrientBox}>
                  <Text style={styles.nutrientLabel}>स्फुरद (P)</Text>
                  <Text style={styles.nutrientVal}>{soilReport.phosphorus.value}</Text>
                  <Text style={styles.nutrientUnit}>{soilReport.phosphorus.unit}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: `${soilReport.phosphorus.color}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        { color: soilReport.phosphorus.color },
                      ]}
                    >
                      {soilReport.phosphorus.status}
                    </Text>
                  </View>
                </View>

                {/* Potassium */}
                <View style={styles.nutrientBox}>
                  <Text style={styles.nutrientLabel}>पालाश (K)</Text>
                  <Text style={styles.nutrientVal}>{soilReport.potassium.value}</Text>
                  <Text style={styles.nutrientUnit}>{soilReport.potassium.unit}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: `${soilReport.potassium.color}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        { color: soilReport.potassium.color },
                      ]}
                    >
                      {soilReport.potassium.status}
                    </Text>
                  </View>
                </View>
              </View>

              {/* pH and Organic Carbon Row */}
              <View style={styles.secondaryNutrientsRow}>
                <View style={styles.secNutrientItem}>
                  <Text style={styles.secNutrientLabel}>सामू (pH मूल्य):</Text>
                  <Text style={styles.secNutrientVal}>
                    {soilReport.ph.value} ({soilReport.ph.status})
                  </Text>
                </View>
                <View style={styles.secNutrientItem}>
                  <Text style={styles.secNutrientLabel}>सेंद्रिय कर्ब (OC):</Text>
                  <Text style={styles.secNutrientVal}>
                    {soilReport.organicCarbon.value}% ({soilReport.organicCarbon.status})
                  </Text>
                </View>
              </View>

              {/* Advisory Box */}
              <View style={styles.advisoryBox}>
                <View style={styles.advisoryHeader}>
                  <Ionicons name="bulb-outline" size={18} color={Colors.primary} />
                  <Text style={styles.advisoryTitle}>खत व्यवस्थापन सल्ला</Text>
                </View>
                <Text style={styles.advisoryText}>{soilReport.advisory}</Text>
              </View>
            </View>
          </View>
        ) : (
          /* Crop Disease Detection Section */
          <View>
            <View style={[styles.scanBox, { borderColor: '#FED7AA' }]}>
              <View style={[styles.scanIconWrapper, { backgroundColor: '#FFEDD5' }]}>
                <Ionicons name="leaf-outline" size={48} color="#EA580C" />
              </View>
              <Text style={styles.scanBoxTitle}>बाधित पानाचा फोटो काढा</Text>
              <Text style={styles.scanBoxDesc}>
                पिकाच्या रोगाने किंवा किडीने बाधित पानाचा जवळून स्पष्ट फोटो अपलोड करा. आमचे AI मॉडेल रोगाचे तत्काळ अचूक निदान करेल.
              </Text>

              <PrimaryButton
                title={scanning ? 'रोग निदान सुरू आहे...' : 'पानाचा फोटो घ्या'}
                icon="camera"
                onPress={handleStartScan}
                loading={scanning}
                style={styles.scanActionBtn}
              />
            </View>

            {/* Diagnostic Report */}
            <View style={styles.resultsCard}>
              <View style={styles.diseaseHeader}>
                <View>
                  <Text style={styles.cropTitle}>{cropDiagnostic.cropName}</Text>
                  <Text style={styles.diseaseName}>{cropDiagnostic.diseaseName}</Text>
                </View>
                <View style={styles.confidenceChip}>
                  <Text style={styles.confidenceText}>
                    {cropDiagnostic.confidence}% अचूकता
                  </Text>
                </View>
              </View>

              <View style={styles.symptomsBox}>
                <Text style={styles.symptomsTitle}>लक्षणे:</Text>
                <Text style={styles.symptomsText}>{cropDiagnostic.symptoms}</Text>
              </View>

              {/* Remedies */}
              <View style={styles.remedyBoxOrganic}>
                <View style={styles.remedyHeader}>
                  <Ionicons name="leaf" size={16} color={Colors.primary} />
                  <Text style={styles.remedyTitleOrganic}>सेंद्रिय व जैविक उपाय:</Text>
                </View>
                <Text style={styles.remedyText}>{cropDiagnostic.organicRemedy}</Text>
              </View>

              <View style={styles.remedyBoxChemical}>
                <View style={styles.remedyHeader}>
                  <Ionicons name="flask" size={16} color="#DC2626" />
                  <Text style={styles.remedyTitleChemical}>रासायनिक शिफारस (तात्काळ):</Text>
                </View>
                <Text style={styles.remedyText}>{cropDiagnostic.chemicalRemedy}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
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
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  scanBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  scanIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  scanBoxTitle: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  scanBoxDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: Spacing.sm,
  },
  scanActionBtn: {
    marginTop: Spacing.lg,
    width: '100%',
  },
  resultsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xxl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultsTitle: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  ocrBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  ocrBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: '#B45309',
  },
  nutrientsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  nutrientBox: {
    flex: 1,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  nutrientLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  nutrientVal: {
    fontSize: Typography.sizes.headline,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  nutrientUnit: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  statusPill: {
    borderRadius: Radii.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: Typography.weights.bold,
  },
  secondaryNutrientsRow: {
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  secNutrientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  secNutrientLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  secNutrientVal: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  advisoryBox: {
    backgroundColor: Colors.mintTint,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.mintBorder,
  },
  advisoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  advisoryTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    marginLeft: 4,
  },
  advisoryText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    lineHeight: 18,
  },
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  cropTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  diseaseName: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.heavy,
    color: '#B91C1C',
    marginTop: 2,
  },
  confidenceChip: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.success,
  },
  symptomsBox: {
    backgroundColor: Colors.surfaceMuted,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    marginBottom: Spacing.md,
  },
  symptomsTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  symptomsText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  remedyBoxOrganic: {
    backgroundColor: Colors.mintTint,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.mintBorder,
    marginBottom: Spacing.sm,
  },
  remedyTitleOrganic: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    marginLeft: 4,
  },
  remedyBoxChemical: {
    backgroundColor: '#FEF2F2',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  remedyTitleChemical: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: '#B91C1C',
    marginLeft: 4,
  },
  remedyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  remedyText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
});
