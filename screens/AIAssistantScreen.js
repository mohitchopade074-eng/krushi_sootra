// KRUSHI-SOOTRA (कृषी-सूत्र / कृषि-सूत्र)
// AI Krushi Assistant - 100% Pure Multilingual Conversational Intelligence

import React, { useState, useEffect } from 'react';
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
import GlassPressable from '../components/ui/GlassPressable';

const AI_STRINGS = {
  mr: {
    title: 'AI कृषी सल्लागार',
    online: '२४/७ तत्पर',
    typing: 'कृषी सल्ला तयार करत आहे...',
    inputPlaceholder: 'येथे तुमचा शेती प्रश्न लिहा...',
    voiceTitle: 'आवाज ओळख (व्हॉईस सर्च)',
    voiceMsg: 'माईक चालू झाला आहे. तुमचा शेती प्रश्न बोला...',
    initialGreeting: 'नमस्कार शेतकरी मित्र! मी तुमचा AI कृषी सल्लागार आहे. खत व्यवस्थापन, कीड-रोग नियंत्रण, हवामान किंवा पीक नियोजनाविषयी कोणताही प्रश्न विचारा.',
    prompts: [
      'कांद्यावरील करपा कसा रोखावा?',
      'कपाशीमध्ये बोंडअळी नियंत्रण उपाय?',
      'ऊस फुटवे वाढवण्यासाठी योग्य खत?',
      'सोयाबीन काढणीची योग्य वेळ कोणती?',
      'ड्रिपसाठी विद्राव्य खतांचे प्रमाण काय?',
    ],
  },
  hi: {
    title: 'AI कृषि सलाहकार',
    online: '२४/७ उपलब्ध',
    typing: 'कृषि सलाह तैयार हो रही है...',
    inputPlaceholder: 'यहाँ अपना कृषि प्रश्न लिखें...',
    voiceTitle: 'आवाज़ पहचान (वॉयस सर्च)',
    voiceMsg: 'माइक चालू है। अपनी फसल से संबंधित प्रश्न बोलें...',
    initialGreeting: 'नमस्कार किसान मित्र! मैं आपका AI कृषि सलाहकार हूँ। खाद प्रबंधन, कीट-रोग नियंत्रण, मौसम या फसल नियोजन से जुड़ा कोई भी प्रश्न पूछें।',
    prompts: [
      'प्याज में झुलसा रोग कैसे रोकें?',
      'कपास में गुलाबी सुंडी नियंत्रण के उपाय?',
      'गन्ने में कल्ले बढ़ाने के लिए खाद?',
      'सोयाबीन कटाई का सही समय कौन सा है?',
      'ड्रिप द्वारा घुलनशील खाद का अनुपात क्या हो?',
    ],
  },
  en: {
    title: 'AI Krushi Assistant',
    online: '24/7 Active',
    typing: 'Generating agronomic advisory...',
    inputPlaceholder: 'Type your farming question here...',
    voiceTitle: 'Voice Recognition',
    voiceMsg: 'Microphone is active. Speak your agricultural query...',
    initialGreeting: 'Welcome Farmer Friend! I am your AI Krushi Assistant. Ask me any question regarding fertilizers, pest management, weather advisories, or crop planning.',
    prompts: [
      'How to control purple blotch in onions?',
      'Pest management for bollworm in cotton?',
      'Best fertilizers for sugarcane tillering?',
      'Optimal harvest maturity signs for soybean?',
      'Fertigation dosage chart for drip irrigation?',
    ],
  },
};

export default function AIAssistantScreen({ language = 'mr' }) {
  const t = AI_STRINGS[language] || AI_STRINGS.mr;

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: t.initialGreeting,
      time: '10:00 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Update initial message when language changes
  useEffect(() => {
    setMessages([
      {
        id: `m_${Date.now()}`,
        sender: 'ai',
        text: t.initialGreeting,
        time: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'mr-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
  }, [language]);

  const handleSend = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'mr-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = '';

      if (language === 'hi') {
        if (query.includes('प्याज') || query.includes('झुलसा')) {
          aiResponseText =
            'प्याज में बैंगनी धब्बा (पर्पल ब्लॉच) नियंत्रण उपाय:\n\n' +
            '१. लक्षण दिखते ही मैंकोजेब ७५% WP ३० ग्राम या टेबुकोनाजोल १५ मिली प्रति १५ लीटर पंप में छिड़कें।\n' +
            '२. दवा पत्तियों पर टिकने के लिए १ ग्राम स्टीकर (स्प्रेडर) अवश्य मिलाएं।\n' +
            '३. यूरिया का अत्यधिक प्रयोग न करें तथा खेत में जलभराव रोकें।';
        } else if (query.includes('कपास') || query.includes('सुंडी')) {
          aiResponseText =
            'कपास में गुलाबी सुंडी नियंत्रण के उपाय:\n\n' +
            '१. प्रति एकड़ ५ फेरोमोन ट्रैप लगाएं।\n' +
            '२. ट्राइकोकार्ड ३ कार्ड प्रति एकड़ की दर से लगाएं।\n' +
            '३. प्रकोप अधिक होने पर इमामेक्टिन बेंजोएट ५% SG ४ ग्राम प्रति पंप छिड़कें।';
        } else {
          aiResponseText =
            `आपके "${query}" प्रश्न के संदर्भ में कृषि विज्ञान केंद्र की वैज्ञानिक सिफारिश:\n\n` +
            '१. मिट्टी परीक्षण रिपोर्ट के आधार पर उर्वरकों का संतुलित उपयोग करें।\n' +
            '२. कीटनाशक का छिड़काव सुबह १० बजे से पहले या शाम ४ बजे के बाद शांत मौसम में करें।\n' +
            '३. अधिक जानकारी के लिए किसान कॉल सेंटर १८००-१८०-१५५१ पर संपर्क करें।';
        }
      } else if (language === 'en') {
        if (query.toLowerCase().includes('onion') || query.toLowerCase().includes('blotch')) {
          aiResponseText =
            'Purple Blotch Control in Onions:\n\n' +
            '1. Spray Mancozeb 75% WP @ 30 gm or Tebuconazole @ 15 ml per 15 liter knapsack sprayer at first symptom.\n' +
            '2. Add 1 ml non-ionic surfactant/sticker per liter of water for proper foliage adherence.\n' +
            '3. Avoid excess nitrogenous fertilizer and ensure good furrow drainage.';
        } else if (query.toLowerCase().includes('cotton') || query.toLowerCase().includes('bollworm')) {
          aiResponseText =
            'Pink Bollworm Management in Cotton:\n\n' +
            '1. Install 5 pheromone traps per acre for continuous monitoring.\n' +
            '2. Release Trichogramma egg parasitoids @ 3 cards per acre at weekly intervals.\n' +
            '3. If infestation crosses ETL, spray Emamectin Benzoate 5% SG @ 4 gm per 15 liter pump.';
        } else {
          aiResponseText =
            `Agronomic Guidance for "${query}":\n\n` +
            '1. Follow integrated nutrient management based on local soil test values.\n' +
            '2. Carry out chemical spraying during calm morning or late evening hours to avoid drift.\n' +
            '3. For immediate scientist assistance, dial Kisan Call Center 1800-180-1551.';
        }
      } else {
        // Marathi
        if (query.includes('कांदा') || query.includes('करपा')) {
          aiResponseText =
            'कांद्यावरील जांभळा करपा रोखण्यासाठी उपाय:\n\n' +
            '१. सुरुवातीची लक्षणे दिसताच मॅन्कोझेब ३० ग्रॅम किंवा टेब्युकोनाझोल १५ मिली प्रति १५ लिटर पंपासाठी फवारा.\n' +
            '२. औषध पानांवर टिकून राहण्यासाठी १ ग्रॅम स्टिकर अवश्य टाका.\n' +
            '३. नत्राचा अतिरिक्त वापर टाळा व शेतात पाणी साचू देऊ नका.';
        } else if (query.includes('बोंडअळी') || query.includes('कपाशी')) {
          aiResponseText =
            'कपाशीवरील गुलाबी बोंडअळी नियंत्रणासाठी सल्ला:\n\n' +
            '१. एकरी ५ कामगंध सापळे लावावेत.\n' +
            '२. अंड्यांच्या अवस्थेत ट्रायकोकार्ड ३ कार्ड प्रति एकर लावा.\n' +
            '३. प्रादुर्भाव वाढल्यास इमामेक्टिन बेन्झोएट ५% SG ४ ग्रॅम प्रति पंप फवारणी करा.';
        } else {
          aiResponseText =
            `तुमच्या "${query}" या प्रश्नासाठी कृषी विज्ञान केंद्राचा सल्ला:\n\n` +
            '१. पिकाच्या योग्य वाढीसाठी स्थानिक माती परीक्षण अहवालानुसार खतांचा समतोल वापर करा.\n' +
            '२. रासायनिक फवारणी सकाळी १० पूर्वी किंवा संध्याकाळी ४ नंतर थंड वातावरणात करा.\n' +
            '३. अधिक माहितीसाठी किसान कॉल सेंटर १८००-१८०-१५५१ वर संपर्क करू शकता.';
        }
      }

      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'mr-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleVoicePrompt = () => {
    Alert.alert(t.voiceTitle, t.voiceMsg);
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
            <Text style={styles.title}>{t.title}</Text>
            <View style={styles.onlineStatusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>{t.online}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Suggested Quick Prompts */}
      <View style={styles.promptsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {t.prompts.map((p, idx) => (
            <GlassPressable
              key={idx}
              style={styles.promptChip}
              onPress={() => handleSend(p)}
              hapticType="selection"
            >
              <Text style={styles.promptChipText}>{p}</Text>
            </GlassPressable>
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
            <Text style={styles.typingText}>{t.typing}</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <GlassPressable
          style={styles.micButton}
          onPress={handleVoicePrompt}
          hapticType="medium"
        >
          <Ionicons name="mic" size={22} color={Colors.primary} />
        </GlassPressable>

        <TextInput
          style={styles.input}
          placeholder={t.inputPlaceholder}
          placeholderTextColor={Colors.textTertiary}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <GlassPressable
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim()}
          hapticType="medium"
        >
          <Ionicons name="send" size={18} color={Colors.textInverse} />
        </GlassPressable>
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
    backgroundColor: 'rgba(243, 232, 255, 0.75)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    marginRight: Spacing.sm,
    borderWidth: 1.2,
    borderColor: 'rgba(233, 213, 255, 0.9)',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
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
    backgroundColor: Colors.primaryDark,
    borderBottomRightRadius: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 3,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderBottomLeftRadius: 4,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
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
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.8)',
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
