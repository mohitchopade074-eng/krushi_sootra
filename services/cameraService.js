// KRUSHI-SOOTRA (कृषी-सूत्र)
// Device Camera & Media Library Service for Soil & Crop Diagnostics

import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/**
 * Capture photo directly using device camera
 */
export async function takePhotoWithCamera() {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'कॅमेरा परवानगी आवश्यक',
        'माती आरोग्य पत्रिका किंवा पिकाच्या पानाचा फोटो काढण्यासाठी कॅमेरा परवानगी द्या.'
      );
      return { success: false, error: 'Camera permission denied' };
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return {
        success: true,
        uri: result.assets[0].uri,
        width: result.assets[0].width,
        height: result.assets[0].height,
      };
    }

    return { success: false, cancelled: true };
  } catch (error) {
    console.warn('Camera capture error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Pick an existing photo from device gallery
 */
export async function pickImageFromGallery() {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'गॅलरी परवानगी आवश्यक',
        'फोटो निवडण्यासाठी गॅलरीची परवानगी द्या.'
      );
      return { success: false, error: 'Media library permission denied' };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return {
        success: true,
        uri: result.assets[0].uri,
      };
    }

    return { success: false, cancelled: true };
  } catch (error) {
    console.warn('Gallery picker error:', error);
    return { success: false, error: error.message };
  }
}
