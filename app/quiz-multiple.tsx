import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useTheme, themes } from "./contexts/ThemeContext";
import { useLanguage } from "./contexts/LanguageContext";
import { useStatistics } from "./contexts/StatisticsContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MultipleChoiceQuizScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [selectedTable, setSelectedTable] = useState<number | null>(
    params.table ? parseInt(params.table as string) : null
  );
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(() =>
    generateQuestion(selectedTable, usedQuestions, setUsedQuestions)
  );
  const [options, setOptions] = useState<number[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [buttonScales] = useState(Array(6).fill(new Animated.Value(1)));
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { addAttempt } = useStatistics();
  const currentTheme = themes[theme];
  const { width } = Dimensions.get("window");
  const isSmallScreen = width <= 360;

  let lastCorrectIndex = -1;

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
        num1 = Math.floor(Math.random() * 12) + 1; // Tables go from 1-12
      }
      num2 = Math.floor(Math.random() * 10) + 1; // Multiplier goes from 1-10
      questionKey = `${num1}x${num2}`;
      attempts++;
    } while (used.has(questionKey) && attempts < maxAttempts);

    // If all possible questions have been used or too many attempts, reset the history
    if (attempts >= maxAttempts) {
      setUsed(new Set());
    } else {
      setUsed((prev) => new Set(prev).add(questionKey));
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
    const newQuestion = generateQuestion(
      selectedTable,
      usedQuestions,
      setUsedQuestions
    );
    setCurrentQuestion(newQuestion);
    setOptions(generateOptions(newQuestion.num1 * newQuestion.num2));
    setFeedback("");
    setSelectedAnswer(null);
  }, [selectedTable, usedQuestions]);

  function generateOptions(correctAnswer: number) {
    const options = new Set<number>();
    options.add(correctAnswer);

    while (options.size < 6) {
      const wrong = Math.max(
        1,
        correctAnswer + (Math.floor(Math.random() * 21) - 10)
      );
      if (wrong !== correctAnswer) {
        options.add(wrong);
      }
    }

    const optionsArray = Array.from(options);
    let currentCorrectIndex;
    do {
      for (let i = optionsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
      }
      currentCorrectIndex = optionsArray.indexOf(correctAnswer);
    } while (currentCorrectIndex === lastCorrectIndex);

    lastCorrectIndex = currentCorrectIndex;
    return optionsArray;
  }

  // Only run on initial mount and table change
  useEffect(() => {
    generateNewQuestion();
  }, [selectedTable]);

  const handleAnswer = useCallback(
    async (answer: number, index: number) => {
      if (selectedAnswer !== null || isProcessingAnswer) return;

      setIsProcessingAnswer(true);
      setSelectedAnswer(answer);

      const correctAnswer = currentQuestion.num1 * currentQuestion.num2;
      const isCorrect = answer === correctAnswer;

      addAttempt(currentQuestion.num1, currentQuestion.num2, isCorrect);

      if (isCorrect) {
        setFeedback(t.correct);
        // Get the table number from the current question
        const tableNumber = currentQuestion.num1;
        const key = `table_${tableNumber}_score`;

        // Load current score for this table
        const savedScore = await AsyncStorage.getItem(key);
        const currentTableScore = savedScore ? parseInt(savedScore) : 0;
        const newScore = currentTableScore + 1;

        // Save new score
        await AsyncStorage.setItem(key, newScore.toString());

        // If we're in a specific table view, update the displayed score
        if (selectedTable === tableNumber) {
          setHighScore(newScore);
        } else if (!selectedTable) {
          // In "All" mode, reload the total score
          let totalScore = 0;
          for (let table = 1; table <= 12; table++) {
            const tableKey = `table_${table}_score`;
            const tableScore = await AsyncStorage.getItem(tableKey);
            if (tableScore) {
              totalScore += parseInt(tableScore);
            }
          }
          setHighScore(totalScore);
        }
      } else {
        setFeedback(`${t.incorrect} ${correctAnswer}`);
      }

      // Animate the selected button
      Animated.sequence([
        Animated.spring(buttonScales[index], {
          toValue: 0.95,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScales[index], {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback("");
        setIsProcessingAnswer(false);
        generateNewQuestion();
      }, 2000);
    },
    [
      currentQuestion,
      selectedAnswer,
      isProcessingAnswer,
      buttonScales,
      t,
      selectedTable,
    ]
  );

  const renderTableSelection = () => {
    return (
      <View style={styles.tableSelector}>
        <TouchableOpacity
          style={[
            styles.allTablesButton,
            !selectedTable && { backgroundColor: currentTheme.primary },
            { borderColor: currentTheme.primary },
          ]}
          onPress={() => {
            setSelectedTable(null);
            router.setParams({});
            generateNewQuestion();
          }}
        >
          <Text
            style={[
              styles.allTablesText,
              { color: currentTheme.text },
              !selectedTable && { color: currentTheme.background },
            ]}
          >
            {t.allTables}
          </Text>
        </TouchableOpacity>
        <View style={styles.numbersContainer}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.numberButton,
                selectedTable === num && {
                  backgroundColor: currentTheme.primary,
                },
                isSmallScreen && { paddingVertical: 2 },
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
                  selectedTable === num && { color: currentTheme.background },
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

  // Load high score when table changes
  useEffect(() => {
    const loadHighScore = async () => {
      try {
        if (selectedTable) {
          const key = `table_${selectedTable}_score`;
          const savedScore = await AsyncStorage.getItem(key);
          setHighScore(savedScore ? parseInt(savedScore) : 0);
        } else {
          // Sum up all table scores for global score
          let totalScore = 0;
          for (let table = 1; table <= 12; table++) {
            const key = `table_${table}_score`;
            const savedScore = await AsyncStorage.getItem(key);
            if (savedScore) {
              totalScore += parseInt(savedScore);
            }
          }
          setHighScore(totalScore);
        }
      } catch (error) {
        console.error("Error loading score:", error);
      }
    };
    loadHighScore();
  }, [selectedTable]);

  // Save high score when score changes
  useEffect(() => {
    const saveHighScore = async () => {
      if (!selectedTable) return; // Don't save global score as it's computed
      try {
        const key = `table_${selectedTable}_score`;
        await AsyncStorage.setItem(key, highScore.toString());
      } catch (error) {
        console.error("Error saving score:", error);
      }
    };
    saveHighScore();
  }, [highScore, selectedTable]);

  return (
    <View
      style={[
        styles.container,
        isSmallScreen && { padding: 12 },
        { backgroundColor: currentTheme.background },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Link href="/" asChild>
          <TouchableOpacity
            style={[styles.homeButton, isSmallScreen && { padding: 6 }]}
          >
            <Ionicons
              name="home-outline"
              size={isSmallScreen ? 18 : 24}
              color={currentTheme.text}
            />
          </TouchableOpacity>
        </Link>
      </View>

      {renderTableSelection()}

      <View
        style={[styles.scoreContainer, isSmallScreen && { marginBottom: 8 }]}
      >
        <Text
          style={[
            styles.scoreText,
            isSmallScreen && { fontSize: 14 },
            { color: currentTheme.secondary },
          ]}
        >
          {selectedTable
            ? t.tableScore.replace("{{table}}", selectedTable.toString())
            : t.globalScore}
          : <Text style={styles.scoreNumber}>{highScore.toLocaleString()}</Text>
        </Text>
      </View>

      <View
        style={[
          styles.questionContainer,
          isSmallScreen && { paddingVertical: 8 },
          { backgroundColor: currentTheme.card },
        ]}
      >
        <Text
          style={[
            styles.questionText,
            isSmallScreen && { fontSize: 24 },
            { color: currentTheme.text },
          ]}
        >
          {currentQuestion.num1} × {currentQuestion.num2} = ?
        </Text>
      </View>

      <Text
        style={[
          styles.chooseText,
          isSmallScreen && { fontSize: 14 },
          { color: currentTheme.secondary },
        ]}
      >
        {t.chooseAnswer}
      </Text>

      <View
        style={[
          styles.optionsContainer,
          isSmallScreen && { gap: 6, marginBottom: 14 },
        ]}
      >
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
                isSmallScreen && { padding: 10 },
                { backgroundColor: currentTheme.card },
              ]}
              onPress={() => handleAnswer(option, index)}
              disabled={!!feedback}
            >
              <Text
                style={[
                  styles.optionText,
                  isSmallScreen && { fontSize: 18 },
                  { color: currentTheme.text },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {feedback ? (
        <Text
          style={[
            styles.feedback,
            feedback.includes("🎉")
              ? styles.correctFeedback
              : styles.incorrectFeedback,
            isSmallScreen && { fontSize: 1, marginBottom: 4 },
          ]}
        >
          {feedback}
        </Text>
      ) : null}

      <Link
        href={{
          pathname: "/quiz",
          params: { table: selectedTable?.toString() },
        }}
        asChild
      >
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isSmallScreen && { padding: 10 },
            { backgroundColor: currentTheme.secondary },
          ]}
        >
          <View style={styles.toggleButtonContent}>
            <Ionicons
              name="keypad-outline"
              size={isSmallScreen ? 18 : 24}
              color={currentTheme.buttonText}
            />
            <Text
              style={[
                styles.toggleButtonText,
                isSmallScreen && { fontSize: 14 },
                { color: currentTheme.buttonText },
              ]}
            >
              {t.switchToInput}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>

      <Link href="/study" asChild>
        <TouchableOpacity
          style={[
            styles.backButton,
            isSmallScreen && { padding: 10 },
            { backgroundColor: currentTheme.secondary },
          ]}
        >
          <View style={styles.backButtonContent}>
            <Ionicons
              name="arrow-back"
              size={isSmallScreen ? 18 : 24}
              color={currentTheme.buttonText}
            />
            <Text
              style={[
                styles.backButtonText,
                isSmallScreen && { fontSize: 14 },
                { color: currentTheme.buttonText },
              ]}
            >
              {t.backToStudy}
            </Text>
          </View>
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
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  scoreNumber: {
    fontSize: 20,
  },
  highScoreText: {
    fontSize: 16,
  },
  questionContainer: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
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
    fontWeight: "bold",
  },
  chooseText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  optionWrapper: {
    width: "48%",
  },
  optionButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  optionText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  feedback: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  correctFeedback: {
    backgroundColor: "#4CAF50",
    color: "#fff",
  },
  incorrectFeedback: {
    backgroundColor: "#f44336",
    color: "#fff",
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
    alignSelf: "center",
    marginBottom: 8,
  },
  allTablesText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  numbersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  numberButton: {
    paddingVertical: 6,
    width: "16%",
    alignItems: "center",
    marginVertical: 2,
    borderRadius: 6,
  },
  numberText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: "auto",
  },
  backButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  toggleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#666",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 25,
    paddingVertical: 12,
    marginTop: 10,
    gap: 8,
  },
  toggleButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
