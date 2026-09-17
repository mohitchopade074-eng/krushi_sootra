// KRUSHI-SOOTRA (कृषी-सूत्र)
// AI Krushi Assistant (कृषी मित्र) - Conversational Agricultural Intelligence

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows, Spacing, Typography } from '../constants/theme';

const QUICK_PROMPTS = [
  'कांद्यावरील करपा कसा रोखावा?',
  'कपाशीमध्ये बोंडअळी नियंत्रण उपाय?',
  'ऊस फुटवे वाढवण्यासाठी योग्य खत?',
  'सोयाबीन काढणीची योग्य वेळ कोणती?',
  'ड्रिपसाठी विद्राव्य खतांचे प्रमाण काय?',
];

const INITIAL_MESSAGES = [
  {
    id: 'm1',
    sender: 'ai',
    text: 'नमस्कार शेतकरी मित्र! मी तुमचा AI कृषी सल्लागार आहे. खत व्यवस्थापन, कीड-रोग नियंत्रण, हवामान किंवा पीक नियोजनाविषयी कोणताही प्रश्न विचारा.',
    time: 'आताच',
  },
];

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Realistic agronomic knowledge response generator
    setTimeout(() => {
      let aiResponseText = '';

      if (query.includes('कांदा') || query.includes('करपा')) {
        aiResponseText =
          'कांद्यावरील जांभळा करपा (Purple Blotch) रोखण्यासाठी उपाय:\n\n' +
          '१. सुरुवातीची लक्षणे दिसताच मॅन्कोझेब (Mancozeb 75% WP) ३० ग्रॅम किंवा प्रोपिकोनाझोल (Tilt) १५ मिली प्रति १५ लिटर पंपासाठी फवारा.\n' +
          '२. औषध पानांवर टिकून राहण्यासाठी १ ग्रॅम स्टिकर (Spreader) अवश्य टाका.\n' +
          '३. नत्राचा (युरिया) अतिरिक्त वापर टाळा व शेतात पाणी साचू देऊ नका.';
      } else if (query.includes('बोंडअळी') || query.includes('कपाशी')) {
        aiResponseText =
          'कपाशीवरील गुलाबी बोंडअळी नियंत्रणासाठी सल्ला:\n\n' +
          '१. एकरी ५ कामगंध सापळे (Pheromone Traps) लावावेत.\n' +
          '२. अंड्यांच्या अवस्थेत ट्रायकोकार्ड (Trichogramma) ३ कार्ड प्रति एकर लावा.\n' +
          '३. प्रादुर्भाव वाढल्यास इमामेक्टिन बेन्झोएट ५% SG ४ ग्रॅम किंवा प्रोफेनोफॉस ५०% EC ३० मिली प्रति पंप फवारणी करा.';
      } else if (query.includes('ऊस') || query.includes('फुटवे')) {
        aiResponseText =
          'ऊसाच्या जोमदार फुटव्यांसाठी खत नियोजन:\n\n' +
          '१. लागवडीनंतर ४५ व्या दिवशी प्रति एकरी ५० किलो युरिया + ५० किलो डीएपी + २५ किलो म्युरेट ऑफ पोटॅश (MOP) द्या.\n' +
          '२. फुटवे वाढीसाठी १९:१९:१९ विद्राव्य खताची (५ ग्रॅम/लिटर) फवारणी करा.\n' +
          '३. पाणी साचू न देता वाफसा स्थितीत पाणी द्या.';
      } else {
        aiResponseText =
          `तुमच्या "${query}" या प्रश्नासाठी कृषी विज्ञान केंद्राच्या शिफारशीनुसार:\n\n` +
          '१. पिकाच्या योग्य वाढीसाठी स्थानिक माती परीक्षण अहवालानुसार खतांचा समतोल वापर करा.\n' +
          '२. रासायनिक फवारणी सकाळी १० पूर्वी किंवा संध्याकाळी ४ नंतर थंड वातावरणात करा.\n' +
          '३. अधिक माहितीसाठी मोफत किसान कॉल सेंटर १८००-१८०-१५५१ वर संपर्क करू शकता.';
      }

      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleVoicePrompt = () => {
    Alert.alert(
      'व्हॉईस सर्च (आवाज ओळख)',
      'माईक चालू झाला आहे. तुमचा शेती प्रश्न बोला...\n(Voice Recognition simulation)'
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={20} color="#7C3AED" />
          </View>
          <View>
            <Text style={styles.title}>AI कृषी सल्लागार</Text>
            <View style={styles.onlineStatusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>२४/७ तत्पर</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Suggested Quick Prompts */}
      <View style={styles.promptsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {QUICK_PROMPTS.map((p, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.promptChip}
              onPress={() => handleSend(p)}
              activeOpacity={0.8}
            >
              <Text style={styles.promptChipText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Messages */}
      <ScrollView
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <View
              key={m.id}
              style={[
                styles.messageBubble,
                isUser ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isUser ? styles.userText : styles.aiText,
                ]}
              >
                {m.text}
              </Text>
              <Text
                style={[
                  styles.timeText,
                  isUser ? styles.userTime : styles.aiTime,
                ]}
              >
                {m.time}
              </Text>
            </View>
          );
        })}

        {isTyping && (
          <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#7C3AED" />
            <Text style={styles.typingText}>कृषी सल्ला तयार करत आहे...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity
          style={styles.micButton}
          onPress={handleVoicePrompt}
          activeOpacity={0.8}
        >
          <Ionicons name="mic" size={22} color={Colors.primary} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="येथे तुमचा शेती प्रश्न लिहा..."
          placeholderTextColor={Colors.textTertiary}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim()}
          activeOpacity={0.8}
        >
          <Ionicons name="send" size={18} color={Colors.textInverse} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  onlineStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  onlineText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  promptsContainer: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  promptChip: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  promptChipText: {
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
    color: '#6D28D9',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: Radii.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
    ...Shadows.subtle,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  messageText: {
    fontSize: Typography.sizes.body,
    lineHeight: 22,
  },
  userText: {
    color: Colors.textInverse,
    fontWeight: Typography.weights.medium,
  },
  aiText: {
    color: Colors.textPrimary,
  },
  timeText: {
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  userTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  aiTime: {
    color: Colors.textTertiary,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: Typography.sizes.xs,
    color: '#7C3AED',
    marginLeft: 6,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  micButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.mintTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radii.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    fontSize: Typography.sizes.body,
    maxHeight: 100,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
    ...Shadows.subtle,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textTertiary,
  },
});
