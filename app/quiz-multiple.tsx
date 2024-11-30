import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme, themes } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { useStatistics } from './context/StatisticsContext';

export default function MultipleChoiceQuizScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [selectedTable, setSelectedTable] = useState<number | null>(params.table ? parseInt(params.table as string) : null);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(() => generateQuestion(selectedTable, usedQuestions, setUsedQuestions));
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [buttonScales] = useState(Array(6).fill(new Animated.Value(1))); 
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { addAttempt } = useStatistics();
  const currentTheme = themes[theme];

  function generateQuestion(
    currentTable: number | null,
    used: Set<string>,
    setUsed: React.Dispatch<React.SetStateAction<Set<string>>>
  ) {
    let num1: number;
    let num2: number;
    let questionKey: string;
    let attempts = 0;
    const maxAttempts = 100;

    // Try to generate a unique question
    do {
      if (currentTable) {
        num1 = currentTable;
      } else {
        num1 = Math.floor(Math.random() * 10) + 1;
      }
      num2 = Math.floor(Math.random() * 10) + 1;
      questionKey = `${num1}x${num2}`;
      attempts++;
    } while (used.has(questionKey) && attempts < maxAttempts);

    // If all possible questions have been used or too many attempts, reset the history
    if (attempts >= maxAttempts) {
      setUsed(new Set());
    } else {
      setUsed(prev => new Set(prev).add(questionKey));
    }

    return { num1, num2 };
  }

  // Update selectedTable when params change
  useEffect(() => {
    setSelectedTable(params.table ? parseInt(params.table as string) : null);
    setUsedQuestions(new Set()); // Reset used questions when table changes
  }, [params.table]);

  // Generate new question
  const generateNewQuestion = useCallback(() => {
    const newQuestion = generateQuestion(selectedTable, usedQuestions, setUsedQuestions);
    setCurrentQuestion(newQuestion);
    setOptions(generateOptions(newQuestion.num1 * newQuestion.num2));
    setFeedback('');
    setSelectedAnswer(null);
  }, [selectedTable, usedQuestions]);

  function generateOptions(correctAnswer: number) {
    const options = new Set<number>();
    options.add(correctAnswer);

    while (options.size < 6) {
      const wrong = Math.max(1, correctAnswer + (Math.floor(Math.random() * 21) - 10));
      if (wrong !== correctAnswer) {
        options.add(wrong);
      }
    }

    return Array.from(options).sort((a, b) => a - b);
  }

  // Only run on initial mount and table change
  useEffect(() => {
    generateNewQuestion();
  }, [selectedTable]);

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
      setScore(score + 1);
      setFeedback(t.correct);
    } else {
      setFeedback(`${t.incorrect} ${correctAnswer}`);
    }

    animateButton(index, isCorrect);

    setTimeout(() => {
      generateNewQuestion();
    }, 1500);
  }, [currentQuestion, addAttempt, t, selectedAnswer, animateButton, score, generateNewQuestion]);

  const renderTableSelection = () => {
    return (
      <View style={styles.tableSelector}>
        <TouchableOpacity 
          style={[
            styles.allTablesButton, 
            !selectedTable && { backgroundColor: currentTheme.primary },
            { borderColor: currentTheme.primary }
          ]}
          onPress={() => {
            setSelectedTable(null);
            router.setParams({});
            generateNewQuestion();
          }}
        >
          <Text style={[
            styles.allTablesText, 
            { color: currentTheme.text },
            !selectedTable && { color: currentTheme.background }
          ]}>
            {t.allTables}
          </Text>
        </TouchableOpacity>
        <View style={styles.numbersContainer}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
            <TouchableOpacity
              key={num}
              style={[
                styles.numberButton,
                selectedTable === num && { backgroundColor: currentTheme.primary },
              ]}
              onPress={() => {
                setSelectedTable(num);
                router.setParams({ table: num.toString() });
              }}
            >
              <Text 
                style={[
                  styles.numberText, 
                  { color: currentTheme.text },
                  selectedTable === num && { color: currentTheme.background }
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
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

      {renderTableSelection()}

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
  backButton: {
    fontSize: 18,
    fontWeight: 'bold',
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
  tableSelector: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  allTablesButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  allTablesText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  numberButton: {
    paddingVertical: 6,
    width: '16%',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 6,
  },
  numberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
