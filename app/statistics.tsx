import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useTheme, themes } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { useStatistics } from './context/StatisticsContext';

const StatisticsScreen = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { statistics } = useStatistics();
  const currentTheme = themes[theme];

  const renderNumberStats = (number: number) => {
    const numberStats = statistics[number] || {};
    const equations = Array.from({ length: 12 }, (_, i) => i + 1).map(i => {
      const key = `${number}x${i}`;
      const stats = numberStats[key] || { correct: 0, total: 0 };
      const percentage = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      return { equation: key, percentage, attempts: stats.total };
    });

    return (
      <View key={number} style={[styles.numberCard, { backgroundColor: currentTheme.card }]}>
        <Text style={[styles.numberTitle, { color: currentTheme.text }]}>
          {t.table} {number}
        </Text>
        <View style={styles.equationsContainer}>
          {equations.map(({ equation, percentage, attempts }) => (
            <View key={equation} style={styles.equationRow}>
              <Text style={[styles.equationText, { color: currentTheme.text }]}>
                {equation}
              </Text>
              {attempts > 0 ? (
                <Text
                  style={[
                    styles.percentageText,
                    { color: percentage >= 70 ? '#4CAF50' : percentage >= 40 ? '#FFC107' : '#F44336' }
                  ]}
                >
                  {percentage.toFixed(0)}%
                </Text>
              ) : (
                <Text style={[styles.noDataText, { color: currentTheme.secondary }]}>
                  {t.noAttempts}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.header}>
        <Link href="/study" asChild>
          <TouchableOpacity>
            <Text style={[styles.backButton, { color: currentTheme.text }]}>
              {t.backToStudy}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <ScrollView
        style={[styles.scrollView, { backgroundColor: currentTheme.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: currentTheme.text }]}>{t.statistics}</Text>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(number => renderNumberStats(number))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  numberCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  numberTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  equationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  equationRow: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  equationText: {
    fontSize: 16,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default StatisticsScreen;
