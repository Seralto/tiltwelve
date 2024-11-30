import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useTheme, themes, Theme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  const { t, setLanguage, language } = useLanguage();
  const currentTheme = themes[theme];

  const themeOptions: { value: Theme; label: string; icon: any }[] = [
    { value: 'light', label: 'Light', icon: 'sunny-outline' },
    { value: 'dark', label: 'Dark', icon: 'moon-outline' },
    { value: 'kids', label: 'Kids', icon: 'game-controller-outline' },
  ];

  const languageOptions = [
    { value: 'en-US', label: 'English' },
    { value: 'pt-BR', label: 'Português' },
    { value: 'es-ES', label: 'Español' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.title, { color: currentTheme.text }]}>{t.settings}</Text>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
          {t.theme}
        </Text>
        <View style={styles.themeContainer}>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.themeOption,
                theme === option.value && { 
                  backgroundColor: currentTheme.primary,
                  borderColor: currentTheme.primary,
                },
                { borderColor: currentTheme.text }
              ]}
              onPress={() => setTheme(option.value)}
            >
              <Ionicons
                name={option.icon}
                size={24}
                color={theme === option.value ? currentTheme.background : currentTheme.text}
              />
              <Text
                style={[
                  styles.themeText,
                  { color: theme === option.value ? currentTheme.background : currentTheme.text }
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
          {t.language}
        </Text>
        <View style={styles.languageContainer}>
          {languageOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.languageOption,
                language === option.value && {
                  backgroundColor: currentTheme.primary,
                  borderColor: currentTheme.primary,
                },
                { borderColor: currentTheme.text }
              ]}
              onPress={() => setLanguage(option.value)}
            >
              <Text
                style={[
                  styles.languageText,
                  {
                    color:
                      language === option.value
                        ? currentTheme.background
                        : currentTheme.text,
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Link href="/about" asChild>
        <TouchableOpacity style={[styles.aboutButton, { backgroundColor: currentTheme.secondary }]}>
          <View style={styles.aboutButtonContent}>
            <Ionicons name="information-circle-outline" size={28} color={currentTheme.buttonText} />
            <Text style={[styles.aboutButtonText, { color: currentTheme.buttonText }]}>
              {t.about}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>

      <Link href="/study" asChild>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: currentTheme.secondary }]}>
          <View style={styles.backButtonContent}>
            <Ionicons name="arrow-back" size={24} color={currentTheme.buttonText} />
            <Text style={[styles.backButtonText, { color: currentTheme.buttonText }]}>
              {t.backToStudy}
            </Text>
          </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginHorizontal: 4,
    gap: 8,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginHorizontal: 4,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  aboutButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  aboutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 30,
    marginTop: 10,
    justifyContent: 'center',
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  aboutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 'auto',
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
