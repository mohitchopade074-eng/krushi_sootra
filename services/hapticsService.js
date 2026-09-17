// KRUSHI-SOOTRA (कृषी-सूत्र)
// Native Device Haptic Feedback Service (iOS / Android)

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const triggerHaptic = (type = 'light') => {
  if (Platform.OS === 'web') return;
  try {
    switch (type) {
      case 'selection':
        Haptics.selectionAsync();
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'light':
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  } catch (err) {
    // Graceful fallback on devices without haptic engines
  }
};
