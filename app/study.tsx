import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useTheme, themes } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HIDE_ANSWERS_KEY = '@tiltwelve:hideAnswers';

const StudyScreen = () => {
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [hideAnswers, setHideAnswers] = useState(false);
  const [hiddenAnswers, setHiddenAnswers] = useState<{[key: number]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const selectorNumbers = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
  const firstRowNumbers = selectorNumbers.slice(0, 6); // 1 to 6
  const secondRowNumbers = selectorNumbers.slice(6); // 7 to 12
  const tableNumbers = Array.from({ length: 10 }, (_, i) => i + 1); // 1 to 10
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentTheme = themes[theme];

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const storedHideAnswers = await AsyncStorage.getItem(HIDE_ANSWERS_KEY);
      
      if (storedHideAnswers !== null) {
        setHideAnswers(storedHideAnswers === 'true');
        if (storedHideAnswers === 'true') {
          // If hide answers is enabled, initialize all answers as hidden
          const allHidden = tableNumbers.reduce((acc, num) => {
            acc[num] = true;
            return acc;
          }, {} as {[key: number]: boolean});
          setHiddenAnswers(allHidden);
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMasterHide = async () => {
    const newHideAnswers = !hideAnswers;
    setHideAnswers(newHideAnswers);
    
    try {
      await AsyncStorage.setItem(HIDE_ANSWERS_KEY, String(newHideAnswers));
      
      if (newHideAnswers) {
        // When enabling hide feature, hide all answers
        const allHidden = tableNumbers.reduce((acc, num) => {
          acc[num] = true;
          return acc;
        }, {} as {[key: number]: boolean});
        setHiddenAnswers(allHidden);
      } else {
        // When disabling hide feature, show all answers
        setHiddenAnswers({});
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const revealAnswer = (number: number) => {
    if (!hideAnswers) return;
    setHiddenAnswers(prev => ({
      ...prev,
      [number]: false
    }));
  };

  const renderMultiplicationTable = () => {
    return tableNumbers.map((number) => (
      <View key={number} style={[styles.tableRow, { borderBottomColor: currentTheme.border }]}>
        <View style={styles.equationContainer}>
          <Text style={[styles.tableText, { color: currentTheme.text }]}>
            {selectedNumber} × {number} =
          </Text>
          {hideAnswers ? (
            hiddenAnswers[number] ? (
              <TouchableOpacity 
                onPress={() => revealAnswer(number)}
                style={styles.answerContainer}
              >
                <Ionicons name="eye-off" size={24} color={currentTheme.text} />
              </TouchableOpacity>
            ) : (
              <Text style={[styles.tableText, { color: currentTheme.text }]}>
                {selectedNumber * number}
              </Text>
            )
          ) : (
            <Text style={[styles.tableText, { color: currentTheme.text }]}>
              {selectedNumber * number}
            </Text>
          )}
        </View>
      </View>
    ));
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
        <Text style={{ color: currentTheme.text }}>{t.loading}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentTheme.text }]}>{t.studyTitle}</Text>
        <View style={styles.rightIcons}>
          <TouchableOpacity 
            onPress={toggleMasterHide}
            style={styles.iconButton}
          >
            <Ionicons 
              name={hideAnswers ? "eye-off-outline" : "eye-outline"} 
              size={24} 
              color={currentTheme.text} 
            />
          </TouchableOpacity>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="home-outline" size={24} color={currentTheme.text} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      
      <View style={styles.numberSelectorContainer}>
        <View style={styles.numberRow}>
          {firstRowNumbers.map((number) => (
            <TouchableOpacity
              key={number}
              style={[
                styles.numberButton,
                selectedNumber === number && { backgroundColor: currentTheme.primary },
                { borderColor: currentTheme.primary }
              ]}
              onPress={() => {
                setSelectedNumber(number);
                if (hideAnswers) {
                  // Reset all answers to hidden when changing table
                  const allHidden = tableNumbers.reduce((acc, num) => {
                    acc[num] = true;
                    return acc;
                  }, {} as {[key: number]: boolean});
                  setHiddenAnswers(allHidden);
                }
              }}
            >
              <Text style={[
                styles.numberText,
                { color: selectedNumber === number ? '#fff' : currentTheme.text },
              ]}>
                {number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.numberRow}>
          {secondRowNumbers.map((number) => (
            <TouchableOpacity
              key={number}
              style={[
                styles.numberButton,
                selectedNumber === number && { backgroundColor: currentTheme.primary },
                { borderColor: currentTheme.primary }
              ]}
              onPress={() => {
                setSelectedNumber(number);
                if (hideAnswers) {
                  // Reset all answers to hidden when changing table
                  const allHidden = tableNumbers.reduce((acc, num) => {
                    acc[num] = true;
                    return acc;
                  }, {} as {[key: number]: boolean});
                  setHiddenAnswers(allHidden);
                }
              }}
            >
              <Text style={[
                styles.numberText,
                { color: selectedNumber === number ? '#fff' : currentTheme.text },
              ]}>
                {number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={[styles.tableContainer, { backgroundColor: currentTheme.card }]}>
        {renderMultiplicationTable()}
      </ScrollView>

      <Link href="/quiz-mode" asChild>
        <TouchableOpacity style={[styles.quizButton, { backgroundColor: currentTheme.primary }]}>
          <Text style={[styles.quizButtonText, { color: currentTheme.buttonText }]}>
            {t.takeQuiz}
          </Text>
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
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  numberSelectorContainer: {
    marginBottom: 20,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  numberButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
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
  equationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'flex-end',
  },
  tableText: {
    fontSize: 20,
    marginLeft: 10,
  },
  hiddenText: {
    fontSize: 20,
    marginLeft: 10,
    letterSpacing: 3,
  },
  quizButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  quizButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StudyScreen;
