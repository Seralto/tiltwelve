import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Link } from 'expo-router';
import { useTheme, themes } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { useStatistics } from './context/StatisticsContext';
import { Ionicons } from '@expo/vector-icons';

export default function MultipleChoiceQuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(generateQuestion());
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [buttonScales] = useState(Array(6).fill(new Animated.Value(1))); 
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { addAttempt } = useStatistics();
  const currentTheme = themes[theme];

  function generateQuestion() {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    return { num1, num2 };
  }

  const generateOptions = useCallback((correctAnswer: number) => {
    const options = new Set<number>();
    options.add(correctAnswer);

    while (options.size < 6) {
      const wrong = Math.max(1, correctAnswer + (Math.floor(Math.random() * 21) - 10));
      if (wrong !== correctAnswer) {
        options.add(wrong);
      }
    }

    return Array.from(options).sort((a, b) => a - b);
  }, []);

  useEffect(() => {
    const question = generateQuestion();
    setCurrentQuestion(question);
    setOptions(generateOptions(question.num1 * question.num2));
  }, []);

  const animateButton = useCallback((index: number, isCorrect: boolean) => {
    const scaleDown = Animated.spring(buttonScales[index], {
      toValue: 0.95,
      useNativeDriver: true,
    });
    const scaleUp = Animated.spring(buttonScales[index], {
      toValue: 1,
      useNativeDriver: true,
    });
    const scaleSequence = Animated.sequence([scaleDown, scaleUp]);

    scaleSequence.start(() => {
      setTimeout(() => {
        if (isCorrect) {
          setScore(score + 1);
        }
        setFeedback('');
        setSelectedAnswer(null);
        const newQuestion = generateQuestion();
        setCurrentQuestion(newQuestion);
        setOptions(generateOptions(newQuestion.num1 * newQuestion.num2));
      }, 1500);
    });
  }, [buttonScales, score]);

  const handleAnswer = useCallback((answer: number, index: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple answers
    
    const correctAnswer = currentQuestion.num1 * currentQuestion.num2;
    const isCorrect = answer === correctAnswer;
    setSelectedAnswer(answer);

    // Add attempt before updating UI
    addAttempt(currentQuestion.num1, currentQuestion.num2, isCorrect);

    if (isCorrect) {
      setFeedback(t.correct);
    } else {
      setFeedback(`${t.incorrect} ${correctAnswer}`);
    }

    animateButton(index, isCorrect);
  }, [currentQuestion, addAttempt, t, selectedAnswer, animateButton]);

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
          {t.score}: {score}
        </Text>
      </View>

      <View style={[styles.questionContainer, { backgroundColor: currentTheme.card }]}>
        <Text style={[styles.questionText, { color: currentTheme.text }]}>
          {currentQuestion.num1} × {currentQuestion.num2} = ?
        </Text>
      </View>

      <Text style={[styles.chooseText, { color: currentTheme.secondary }]}>
        {t.chooseAnswer}
      </Text>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <Animated.View
            key={index}
            style={[
              styles.optionWrapper,
              { transform: [{ scale: buttonScales[index] }] },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: currentTheme.card },
              ]}
              onPress={() => handleAnswer(option, index)}
              disabled={!!feedback}
            >
              <Text style={[styles.optionText, { color: currentTheme.text }]}>
                {option}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
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
          <Text style={[styles.studyButtonText, { color: currentTheme.buttonText }]}>
            {t.backToStudy}
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
  chooseText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 20,
  },
  optionWrapper: {
    width: '48%',
  },
  optionButton: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  optionText: {
    fontSize: 24,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});
