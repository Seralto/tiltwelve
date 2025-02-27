import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useTheme, themes } from "./contexts/ThemeContext";
import { useLanguage } from "./contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";

export default function QuizModeScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentTheme = themes[theme];
  const router = useRouter();
  const { width } = Dimensions.get("window");
  const isSmallScreen = width <= 360;

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Link href="/" asChild>
          <TouchableOpacity style={styles.homeButton}>
            <Ionicons name="home-outline" size={24} color={currentTheme.text} />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Quiz Input Mode */}
      <View style={styles.modesContainer}>
        <TouchableOpacity
          style={[
            styles.modeCard,
            isSmallScreen && { paddingTop: 10, paddingBottom: 12 },
            { backgroundColor: currentTheme.card },
          ]}
          onPress={() => router.push("/quiz")}
        >
          <View style={styles.modeIconContainer}>
            <Ionicons
              name="keypad-outline"
              size={isSmallScreen ? 38 : 48}
              color={currentTheme.buttonText}
            />
          </View>
          <Text
            style={[
              styles.modeTitle,
              isSmallScreen && { fontSize: 18 },
              { color: currentTheme.buttonText },
            ]}
          >
            {t.inputMode}
          </Text>
          <Text
            style={[
              styles.modeDescription,
              isSmallScreen && { fontSize: 14 },
              { color: currentTheme.buttonText },
            ]}
          >
            {t.inputModeDesc}
          </Text>
        </TouchableOpacity>

        {/* Quiz Multiple Choice */}
        <TouchableOpacity
          style={[
            styles.modeCard,
            isSmallScreen && { paddingTop: 6, paddingBottom: 12 },
            { backgroundColor: currentTheme.card },
          ]}
          onPress={() => router.push("/quiz-multiple")}
        >
          <View style={styles.modeIconContainer}>
            <Ionicons
              name="list-outline"
              size={isSmallScreen ? 38 : 48}
              color={currentTheme.buttonText}
            />
          </View>
          <Text
            style={[
              styles.modeTitle,
              isSmallScreen && { fontSize: 18 },
              { color: currentTheme.buttonText },
            ]}
          >
            {t.multipleChoiceMode}
          </Text>
          <Text
            style={[
              styles.modeDescription,
              isSmallScreen && { fontSize: 14 },
              { color: currentTheme.buttonText },
            ]}
          >
            {t.multipleChoiceModeDesc}
          </Text>
        </TouchableOpacity>
      </View>

      <Link href="/study" asChild>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: currentTheme.secondary },
          ]}
        >
          <View style={styles.backButtonContent}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={currentTheme.buttonText}
            />
            <Text
              style={[
                styles.backButtonText,
                { color: currentTheme.buttonText },
                isSmallScreen && { fontSize: 16 },
              ]}
            >
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
    flex: 1,
  },
  settingsButton: {
    padding: 10,
  },
  modesContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  modeCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
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
    fontWeight: "bold",
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: "auto",
  },
  backButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
