import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import { useTheme, themes } from "./contexts/ThemeContext";
import { useLanguage } from "./contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentTheme = themes[theme];
  const { width } = Dimensions.get("window");
  const isSmallScreen = width <= 360;

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
      title: t.competitionTitle,
      icon: "trophy-outline",
      href: "/competition",
      description: t.competitionDescription,
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
      style={[
        styles.container,
        {
          padding: isSmallScreen ? 12 : 16,
          backgroundColor: currentTheme.background,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            fontSize: isSmallScreen ? 28 : 36,
            marginBottom: isSmallScreen ? 24 : 32,
            marginTop: isSmallScreen ? 12 : 16,
            color: currentTheme.text,
          },
        ]}
      >
        TilTwelve
      </Text>

      <View style={[styles.menuContainer, { gap: isSmallScreen ? 12 : 16 }]}>
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href} asChild>
            <TouchableOpacity>
              <View
                style={[
                  styles.cardContent,
                  {
                    borderRadius: isSmallScreen ? 8 : 10,
                    padding: isSmallScreen ? 12 : 16,
                    marginBottom: isSmallScreen ? 6 : 8,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      width: isSmallScreen ? 40 : 48,
                      height: isSmallScreen ? 40 : 48,
                      borderRadius: isSmallScreen ? 20 : 24,
                      marginRight: isSmallScreen ? 12 : 16,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={32}
                    color={currentTheme.text}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.cardTitle,
                      {
                        fontSize: isSmallScreen ? 16 : 18,
                        marginBottom: isSmallScreen ? 2 : 4,
                        color: currentTheme.text,
                      },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardDescription,
                      {
                        fontSize: isSmallScreen ? 14 : 16,
                        color: currentTheme.secondary,
                      },
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
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
  },
  menuContainer: {},
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#666",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: "600",
  },
  cardDescription: {
    opacity: 0.8,
  },
});
