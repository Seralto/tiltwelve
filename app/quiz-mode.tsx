import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme, themes } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

export default function QuizModeScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentTheme = themes[theme];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentTheme.text }]}>{t.selectQuizMode}</Text>
        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={currentTheme.text} />
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.modesContainer}>
        <TouchableOpacity
          style={[styles.modeCard, { backgroundColor: currentTheme.card }]}
          onPress={() => router.push('/quiz')}
        >
          <View style={styles.modeIconContainer}>
            <Ionicons name="keypad-outline" size={48} color={currentTheme.primary} />
          </View>
          <Text style={[styles.modeTitle, { color: currentTheme.text }]}>{t.inputMode}</Text>
          <Text style={[styles.modeDescription, { color: currentTheme.secondary }]}>
            {t.inputModeDesc}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeCard, { backgroundColor: currentTheme.card }]}
          onPress={() => router.push('/quiz-multiple')}
        >
          <View style={styles.modeIconContainer}>
            <Ionicons name="list-outline" size={48} color={currentTheme.primary} />
          </View>
          <Text style={[styles.modeTitle, { color: currentTheme.text }]}>{t.multipleChoiceMode}</Text>
          <Text style={[styles.modeDescription, { color: currentTheme.secondary }]}>
            {t.multipleChoiceModeDesc}
          </Text>
        </TouchableOpacity>
      </View>

      <Link href="/study" asChild>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: currentTheme.primary }]}>
          <Text style={styles.backButtonText}>{t.backToStudy}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  settingsButton: {
    padding: 10,
  },
  modesContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  modeCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  modeIconContainer: {
    marginBottom: 15,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
