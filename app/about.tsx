import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import { useTheme, themes } from "./contexts/ThemeContext";
import { useLanguage } from "./contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";

export default function AboutScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentTheme = themes[theme];
  const { width } = Dimensions.get("window");
  const isSmallScreen = width <= 360;

  const openGithub = () => {
    Linking.openURL("https://github.com/Seralto");
  };

  const openYoutube = () => {
    Linking.openURL("https://www.youtube.com/user/stoledo13");
  };

  const openLinkedin = () => {
    Linking.openURL("https://www.linkedin.com/in/seralto/");
  };

  const openPlayStore = () => {
    Linking.openURL(
      "https://play.google.com/store/apps/developer?id=S%C3%A9rgio+Toledo"
    );
  };

  const openWebsite = () => {
    Linking.openURL("https://sergiotoledo.com.br");
  };

  const openEmail = () => {
    Linking.openURL("mailto:contato@sergiotoledo.com.br");
  };

  return (
    <View
      style={[
        styles.container,
        isSmallScreen && { padding: 16 },
        { backgroundColor: currentTheme.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          isSmallScreen && { fontSize: 20 },
          { color: currentTheme.text },
        ]}
      >
        {t.about}
      </Text>

      <View
        style={[
          styles.card,
          isSmallScreen && { padding: 16 },
          { backgroundColor: currentTheme.card },
        ]}
      >
        <Text
          style={[
            styles.description,
            isSmallScreen && { fontSize: 14, lineHeight: 20 },
            { color: currentTheme.text },
          ]}
        >
          {t.aboutDescription}
        </Text>

        <View
          style={[
            styles.socialButtons,
            isSmallScreen && { gap: 10 },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.socialButton,
              isSmallScreen && { padding: 10 },
              { backgroundColor: "#333333" },
            ]}
            onPress={openGithub}
          >
            <Ionicons
              name="logo-github"
              size={isSmallScreen ? 20 : 24}
              color="#FFFFFF"
            />
            <Text
              style={[
                styles.socialText,
                isSmallScreen && { fontSize: 14 },
                { color: "#FFFFFF" },
              ]}
            >
              GitHub
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialButton,
              isSmallScreen && { padding: 10 },
              { backgroundColor: "#FF0000" },
            ]}
            onPress={openYoutube}
          >
            <Ionicons
              name="logo-youtube"
              size={isSmallScreen ? 20 : 24}
              color="#FFFFFF"
            />
            <Text
              style={[
                styles.socialText,
                isSmallScreen && { fontSize: 14 },
                { color: "#FFFFFF" },
              ]}
            >
              YouTube
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialButton,
              isSmallScreen && { padding: 10 },
              { backgroundColor: "#0077B5" },
            ]}
            onPress={openLinkedin}
          >
            <Ionicons
              name="logo-linkedin"
              size={isSmallScreen ? 20 : 24}
              color="#FFFFFF"
            />
            <Text
              style={[
                styles.socialText,
                isSmallScreen && { fontSize: 14 },
                { color: "#FFFFFF" },
              ]}
            >
              LinkedIn
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialButton,
              isSmallScreen && { padding: 10 },
              { backgroundColor: "#01875F" },
            ]}
            onPress={openPlayStore}
          >
            <Ionicons
              name="logo-google-playstore"
              size={isSmallScreen ? 20 : 24}
              color="#FFFFFF"
            />
            <Text
              style={[
                styles.socialText,
                isSmallScreen && { fontSize: 14 },
                { color: "#FFFFFF" },
              ]}
            >
              Play Store
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialButton,
              isSmallScreen && { padding: 10 },
              { backgroundColor: "#4A90E2" },
            ]}
            onPress={openWebsite}
          >
            <Ionicons
              name="globe-outline"
              size={isSmallScreen ? 20 : 24}
              color="#FFFFFF"
            />
            <Text
              style={[
                styles.socialText,
                isSmallScreen && { fontSize: 14 },
                { color: "#FFFFFF" },
              ]}
            >
              Website
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialButton,
              isSmallScreen && { padding: 10 },
              { backgroundColor: "#2BC652" },
            ]}
            onPress={openEmail}
          >
            <Ionicons
              name="mail-outline"
              size={isSmallScreen ? 20 : 24}
              color="#FFFFFF"
            />
            <Text
              style={[
                styles.socialText,
                isSmallScreen && { fontSize: 14 },
                { color: "#FFFFFF" },
              ]}
            >
              Email
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Link href="/settings" asChild>
        <TouchableOpacity style={styles.backButtonContainer}>
          <Ionicons
            name="arrow-back"
            size={isSmallScreen ? 20 : 24}
            color={currentTheme.text}
          />
          <Text
            style={[
              styles.backButton,
              isSmallScreen && { fontSize: 16 },
              { color: currentTheme.text },
            ]}
          >
            {t.settings}
          </Text>
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
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  backButton: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  socialText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
