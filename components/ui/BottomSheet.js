// KRUSHI-SOOTRA (कृषी-सूत्र)
// Gesture-Driven Frosted Glass Bottom Sheet with Velocity Handoff & Haptics

import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors, Radii, Shadows, Spacing, Typography } from '../../constants/theme';
import { triggerHaptic } from '../../services/hapticsService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BottomSheet({
  visible = false,
  onClose,
  title,
  subtitle,
  children,
}) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Natural velocity handoff and gesture threshold
        if (gestureState.dy > 120 || gestureState.vy > 0.8) {
          triggerHaptic('light');
          dismissSheet();
        } else {
          // Spring back smoothly on interruption
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 260,
            friction: 20,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      triggerHaptic('light');
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 240,
          friction: 22,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      translateY.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
    }
  }, [visible]);

  const dismissSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={dismissSheet}
    >
      <View style={styles.overlay}>
        {/* Animated Dark Frosted Glass Backdrop */}
        <TouchableWithoutFeedback onPress={dismissSheet}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Animated Gesture Sheet Container */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          {Platform.OS !== 'web' ? (
            <BlurView intensity={80} tint="light" style={styles.blurBackground}>
              {renderSheetContent()}
            </BlurView>
          ) : (
            <View style={styles.webSheetBackground}>
              {renderSheetContent()}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );

  function renderSheetContent() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        {/* Gesture Handle Bar with Pan Responder */}
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <View style={styles.handleIndicator} />
        </View>

        {/* Sheet Header */}
        <View style={styles.header}>
          <View style={styles.headerTextGroup}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={dismissSheet}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  sheetContainer: {
    maxHeight: SCREEN_HEIGHT * 0.88,
    minHeight: SCREEN_HEIGHT * 0.42,
    borderTopLeftRadius: Radii.xxl,
    borderTopRightRadius: Radii.xxl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: Colors.glassSurfaceElevated,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  },
  blurBackground: {
    flex: 1,
  },
  webSheetBackground: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  keyboardContainer: {
    flex: 1,
  },
  handleArea: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleIndicator: {
    width: 42,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.6)',
  },
  headerTextGroup: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.subtitle,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xxl,
  },
});
