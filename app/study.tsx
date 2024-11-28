import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useTheme, themes } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

const StudyScreen = () => {
  const [selectedNumber, setSelectedNumber] = useState(2);
  const selectorNumbers = Array.from({ length: 11 }, (_, i) => i + 2); 
  const tableNumbers = Array.from({ length: 10 }, (_, i) => i + 1); 
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentTheme = themes[theme];

  const renderMultiplicationTable = () => {
    return tableNumbers.map((number) => (
      <View key={number} style={[styles.tableRow, { borderBottomColor: currentTheme.border }]}>
        <Text style={[styles.tableText, { color: currentTheme.text }]}>
          {selectedNumber} × {number} = {selectedNumber * number}
        </Text>
      </View>
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentTheme.text }]}>{t.studyTitle}</Text>
        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={currentTheme.text} />
          </TouchableOpacity>
        </Link>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.numberSelector}>
        {selectorNumbers.map((number) => (
          <TouchableOpacity
            key={number}
            style={[
              styles.numberButton,
              { backgroundColor: currentTheme.card },
              selectedNumber === number && { backgroundColor: currentTheme.primary },
            ]}
            onPress={() => setSelectedNumber(number)}
          >
            <Text style={[
              styles.numberText,
              { color: selectedNumber === number ? '#fff' : currentTheme.text },
            ]}>
              {number}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={[styles.tableContainer, { backgroundColor: currentTheme.card }]}>
        {renderMultiplicationTable()}
      </ScrollView>

      <Link href="/quiz-mode" asChild>
        <TouchableOpacity style={[styles.quizButton, { backgroundColor: currentTheme.primary }]}>
          <Text style={styles.quizButtonText}>{t.takeQuiz}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  settingsButton: {
    padding: 10,
  },
  numberSelector: {
    flexGrow: 0,
    marginBottom: 20,
  },
  numberButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  numberText: {
    fontSize: 18,
  },
  tableContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  tableRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tableText: {
    fontSize: 20,
  },
  quizButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StudyScreen;
