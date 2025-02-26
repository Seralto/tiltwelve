import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import { useTheme, themes } from "./contexts/ThemeContext";
import { useLanguage } from "./contexts/LanguageContext";
import { useStatistics } from "./contexts/StatisticsContext";
import { Ionicons } from "@expo/vector-icons";

const StatisticsScreen = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { statistics } = useStatistics();
  const currentTheme = themes[theme];
  const { width } = Dimensions.get("window");
  const isSmallScreen = width <= 360;

  const renderNumberStats = (number: number) => {
    const numberStats = statistics[number] || {};
    const equations = Array.from({ length: 10 }, (_, i) => i + 1).map((i) => {
      const key = `${number}x${i}`;
      const stats = numberStats[key] || { correct: 0, total: 0 };
      const percentage =
        stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      return { equation: key, percentage, attempts: stats.total };
    });

    return (
      <View
        key={number}
        style={[
          styles.numberCard,
          isSmallScreen && { paddingHorizontal: 10, paddingVertical: 14 },
          { backgroundColor: currentTheme.card },
        ]}
      >
        <Text
          style={[
            styles.numberTitle,
            isSmallScreen && { fontSize: 18 },
            { color: currentTheme.text },
          ]}
        >
          {t.table} {number}
        </Text>
        <View
          style={[
            styles.separator,
            { backgroundColor: currentTheme.border },
          ]}
        />
        <View style={styles.equationsContainer}>
          {equations.map(({ equation, percentage, attempts }) => (
            <View key={equation}>
              <View style={styles.equationRow}>
                <Text
                  style={[
                    styles.equationText,
                    { color: currentTheme.text },
                  ]}
                >
                  {equation}
                </Text>
                {attempts > 0 ? (
                  <Text
                    style={[
                      styles.percentageText,
                      {
                        color:
                          percentage >= 70
                            ? "#4CAF50"
                            : percentage >= 40
                            ? "#FFC107"
                            : "#F44336",
                      },
                    ]}
                  >
                    {percentage.toFixed(0)}%
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.noDataText,
                      { color: currentTheme.secondary },
                    ]}
                  >
                    {t.noAttempts}
                  </Text>
                )}
              </View>
              {equations.indexOf(
                equations.find(({ equation }) => equation === equation)
              ) <
                equations.length - 1 && (
                <View
                  style={[
                    styles.innerSeparator,
                    { backgroundColor: currentTheme.border },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        isSmallScreen && { paddingHorizontal: 3, paddingTop: 3 },
        { backgroundColor: currentTheme.background },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Link href="/" asChild>
          <TouchableOpacity style={styles.homeButton}>
            <Ionicons name="home-outline" size={24} color={currentTheme.text} />
          </TouchableOpacity>
        </Link>
      </View>
      <ScrollView
        style={[
          styles.scrollView,
          isSmallScreen && { paddingHorizontal: 12 },
          { backgroundColor: currentTheme.background },
        ]}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.title,
            isSmallScreen && { fontSize: 20 },
            { color: currentTheme.text },
          ]}
        >
          {t.statistics}
        </Text>
        <View style={styles.tablesContainer}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((number) =>
            renderNumberStats(number)
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingTop: 5,
    flex: 1,
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  tablesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  numberCard: {
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: "48%",
  },
  numberTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  separator: {
    height: 2,
    width: "100%",
    marginBottom: 10,
  },
  innerSeparator: {
    height: 1,
    width: "100%",
    marginBottom: 6,
  },
  equationsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  equationRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  equationText: {
    fontSize: 16,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default StatisticsScreen;
