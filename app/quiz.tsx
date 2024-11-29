import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, ScrollView } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme, themes } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { useStatistics } from './context/StatisticsContext';

const QuizScreen = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { addAttempt } = useStatistics();
  const params = useLocalSearchParams();
  const router = useRouter();
  const [options, setOptions] = useState<number[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(params.table ? parseInt(params.table as string) : null);
  const currentTheme = themes[theme];

  function generateQuestion() {
    const num1 = selectedTable || Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
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

  const [currentQuestion, setCurrentQuestion] = useState(generateQuestion());
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
  }, [selectedTable]);

  const checkAnswer = () => {
    if (!answer) return; // Don't process empty answers
    
    const userAnswer = parseInt(answer);
    const correctAnswer = currentQuestion.num1 * currentQuestion.num2;
    const isCorrect = userAnswer === correctAnswer;

    // Add attempt before updating UI
    addAttempt(currentQuestion.num1, currentQuestion.num2, isCorrect);

    if (isCorrect) {
      setScore(score + 1);
      setFeedback(t.correct);
    } else {
      setFeedback(`${t.incorrect} ${correctAnswer}`);
    }

    setTimeout(() => {
      setAnswer('');
      setFeedback('');
      setCurrentQuestion(generateQuestion());
    }, 1500);
  };

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
            const newQuestion = generateQuestion();
            setCurrentQuestion(newQuestion);
            setOptions(generateOptions(newQuestion.num1 * newQuestion.num2));
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
          {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
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

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: currentTheme.card,
            color: currentTheme.text,
          }]}
          value={answer}
          onChangeText={setAnswer}
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={checkAnswer}
          placeholder={t.enterAnswer}
          placeholderTextColor={currentTheme.secondary}
          maxLength={3}
          autoFocus={true}
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
          <Text style={[styles.studyButtonText, { color: currentTheme.buttonText }]}>
            {t.backToStudy}
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
  backButton: {
    fontSize: 18,
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
  selectedAllTables: {
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
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
    width: '18%',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 6,
  },
  numberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuizScreen;
