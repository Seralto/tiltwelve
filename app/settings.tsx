import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Link } from "expo-router";
import { useTheme, themes, Theme } from "./contexts/ThemeContext";
import { useLanguage } from "./contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  const { t, setLanguage, language } = useLanguage();
  const currentTheme = themes[theme];
  const { width } = Dimensions.get("window");
  const isSmallScreen = width <= 360;

  const themeOptions: { value: Theme; label: string; icon: any }[] = [
    { value: "light", label: "Light", icon: "sunny-outline" },
    { value: "dark", label: "Dark", icon: "moon-outline" },
    { value: "kids", label: "Kids", icon: "game-controller-outline" },
  ];

  const languageOptions = [
    { value: "en-US", label: "English" },
    { value: "pt-BR", label: "Português" },
    { value: "es-ES", label: "Español" },
  ];

  return (
    <View
      style={[styles.container, isSmallScreen && { paddingHorizontal: 16 }, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Link href="/" asChild>
          <TouchableOpacity style={styles.homeButton}>
            <Ionicons name="home-outline" size={24} color={currentTheme.text} />
          </TouchableOpacity>
        </Link>
      </View>
      <Text style={[styles.title, isSmallScreen && { fontSize: 20 }, { color: currentTheme.text }]}>{t.settings}</Text>
      <View style={[styles.section, isSmallScreen && { marginBottom: 20 }]}>
        <Text style={[styles.sectionTitle, isSmallScreen && { fontSize: 18 }, { color: currentTheme.text }]}>{t.theme}</Text>
        <View style={styles.themeContainer}>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.themeOption,
                isSmallScreen && { padding: 10 },
                theme === option.value && {
                  backgroundColor: currentTheme.primary,
                  borderColor: currentTheme.primary,
                },
                { borderColor: currentTheme.text },
              ]}
              onPress={() => setTheme(option.value)}
            >
              <Ionicons
                name={option.icon}
                size={isSmallScreen ? 20 : 24}
                color={
                  theme === option.value
                    ? currentTheme.background
                    : currentTheme.text
                }
              />
              <Text
                style={[
                  styles.themeText,
                  isSmallScreen && { fontSize: 14 },
                  {
                    color:
                      theme === option.value
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

      <View style={[styles.section, isSmallScreen && { marginBottom: 20 }]}>
        <Text style={[styles.sectionTitle, isSmallScreen && { fontSize: 18 }, { color: currentTheme.text }]}>{t.language}</Text>
        <View style={styles.languageContainer}>
          {languageOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.languageOption,
                isSmallScreen && { padding: 10 },
                language === option.value && {
                  backgroundColor: currentTheme.primary,
                  borderColor: currentTheme.primary,
                },
                { borderColor: currentTheme.text },
              ]}
              onPress={() => setLanguage(option.value)}
            >
              <Text
                style={[
                  styles.languageText,
                  isSmallScreen && { fontSize: 14 },
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
        <TouchableOpacity
          style={[
            styles.aboutButton,
            isSmallScreen && { padding: 12 },
            { backgroundColor: currentTheme.secondary },
          ]}
        >
          <View style={styles.aboutButtonContent}>
            <Ionicons
              name="information-circle-outline"
              size={isSmallScreen ? 20 : 24}
              color={currentTheme.buttonText}
            />
            <Text
              style={[
                styles.aboutButtonText,
                isSmallScreen && { fontSize: 16 },
                { color: currentTheme.buttonText },
              ]}
            >
              {t.about}
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  homeButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  themeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  themeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginHorizontal: 4,
    gap: 8,
  },
  themeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  languageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  languageOption: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginHorizontal: 4,
  },
  languageText: {
    fontSize: 16,
    fontWeight: "500",
  },
  aboutButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 30,
    marginTop: 20,
    justifyContent: "center",
    borderColor: "#666",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  aboutButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  aboutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
