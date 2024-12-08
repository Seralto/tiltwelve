import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useTheme, themes } from "./contexts/ThemeContext";
import { useLanguage } from "./contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentTheme = themes[theme];

  const menuItems = [
    {
      title: t.studyTitle,
      icon: "book-outline",
      href: "/study",
      description: t.studyDescription || "Learn multiplication tables",
    },
    {
      title: t.quizTitle,
      icon: "school-outline",
      href: "/quiz-mode",
      description: t.quizDescription || "Test your knowledge",
    },
    {
      title: "Competition",
      icon: "trophy-outline",
      href: "/competition",
      description: "Compete with a friend",
    },
    {
      title: t.statistics,
      icon: "stats-chart-outline",
      href: "/statistics",
      description: t.statisticsDescription || "Track your progress",
    },
    {
      title: t.settings,
      icon: "settings-outline",
      href: "/settings",
      description: t.settingsDescription || "Customize your experience",
    },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Text style={[styles.title, { color: currentTheme.text }]}>
        TilTwelve
      </Text>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href} asChild>
            <TouchableOpacity>
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={item.icon as any}
                    size={32}
                    color={currentTheme.text}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[styles.cardTitle, { color: currentTheme.text }]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardDescription,
                      { color: currentTheme.secondary },
                    ]}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    marginTop: 16,
  },
  menuContainer: {
    gap: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#666",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 16,
    opacity: 0.8,
  },
});
