import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useTheme, themes } from './context/ThemeContext';
import { useLanguage, Language } from './context/LanguageContext';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const currentTheme = themes[theme];

  const languages: { code: Language; name: keyof typeof t }[] = [
    { code: 'en-US', name: 'english' },
    { code: 'pt-BR', name: 'portuguese' },
    { code: 'es-ES', name: 'spanish' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.title, { color: currentTheme.text }]}>{t.settings}</Text>

      <ScrollView>
        <View style={[styles.section, { backgroundColor: currentTheme.card }]}>
          <View style={[styles.settingItem, { borderBottomColor: currentTheme.border }]}>
            <Text style={[styles.settingText, { color: currentTheme.text }]}>{t.darkMode}</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: currentTheme.primary }}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>{t.language}</Text>
        <View style={[styles.section, { backgroundColor: currentTheme.card }]}>
          {languages.map((lang, index) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.settingItem,
                index !== languages.length - 1 && { borderBottomColor: currentTheme.border, borderBottomWidth: 1 },
              ]}
              onPress={() => setLanguage(lang.code)}
            >
              <Text style={[styles.settingText, { color: currentTheme.text }]}>
                {t[lang.name]}
              </Text>
              {language === lang.code && (
                <View style={[styles.selectedLanguage, { backgroundColor: currentTheme.primary }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Link href="/study" asChild>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: currentTheme.primary }]}
        >
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  settingText: {
    fontSize: 18,
  },
  selectedLanguage: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
