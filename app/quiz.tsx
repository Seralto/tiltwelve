import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { useTheme, themes } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

const QuizScreen = () => {
  const [currentQuestion, setCurrentQuestion] = useState({ num1: 0, num2: 0 });
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentTheme = themes[theme];

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    setCurrentQuestion({ num1, num2 });
    setAnswer('');
    setFeedback('');
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const checkAnswer = () => {
    const userAnswer = parseInt(answer);
    const correctAnswer = currentQuestion.num1 * currentQuestion.num2;

    if (userAnswer === correctAnswer) {
      setScore(score + 1);
      setFeedback(t.correct);
    } else {
      setFeedback(`${t.incorrect} ${correctAnswer}`);
    }

    setQuestionsAnswered(questionsAnswered + 1);
    setTimeout(generateQuestion, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentTheme.text }]}>{t.quizTitle}</Text>
        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={currentTheme.text} />
          </TouchableOpacity>
        </Link>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreText, { color: currentTheme.secondary }]}>
          {t.score}: {score}/{questionsAnswered}
        </Text>
      </View>

      <View style={[styles.questionContainer, { backgroundColor: currentTheme.card }]}>
        <Text style={[styles.questionText, { color: currentTheme.text }]}>
          {currentQuestion.num1} × {currentQuestion.num2} = ?
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: currentTheme.card,
            color: currentTheme.text,
          }]}
          keyboardType="number-pad"
          value={answer}
          onChangeText={setAnswer}
          placeholder={t.enterAnswer}
          placeholderTextColor={currentTheme.secondary}
          maxLength={3}
        />
        
        <TouchableOpacity 
          style={[
            styles.submitButton,
            { backgroundColor: currentTheme.primary },
            !answer && { opacity: 0.5 }
          ]}
          onPress={checkAnswer}
          disabled={!answer}
        >
          <Text style={styles.submitButtonText}>{t.submit}</Text>
        </TouchableOpacity>
      </View>

      {feedback ? (
        <Text style={[
          styles.feedback,
          feedback.includes('🎉') ? styles.correctFeedback : styles.incorrectFeedback
        ]}>
          {feedback}
        </Text>
      ) : null}

      <Link href="/study" asChild>
        <TouchableOpacity style={[styles.studyButton, { backgroundColor: currentTheme.secondary }]}>
          <Text style={styles.studyButtonText}>{t.backToStudy}</Text>
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
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
  },
  questionContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  questionText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    marginRight: 10,
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedback: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },
  correctFeedback: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  incorrectFeedback: {
    backgroundColor: '#f44336',
    color: '#fff',
  },
  studyButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
  },
  studyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuizScreen;
