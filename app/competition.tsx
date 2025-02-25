import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme, themes } from "./contexts/ThemeContext";
import { useLanguage } from "./contexts/LanguageContext";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const CompetitionScreen = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const { t } = useLanguage();

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({ num1: 8, num2: 4 });
  const [options, setOptions] = useState([32, 28, 21, 36]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<number | null>(null);
  const maxQuestions = 10;
  const [feedback, setFeedback] = useState<{
    message: string;
    player: number | null;
  }>({ message: "", player: null });

  let lastCorrectIndex = -1;

  const generateNewQuestion = () => {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCurrentQuestion({ num1, num2 });
    const correctAnswer = num1 * num2;
    const newOptions = [correctAnswer];
    while (newOptions.length < 4) {
      const wrongAnswer = Math.floor(Math.random() * 144) + 1;
      if (!newOptions.includes(wrongAnswer) && wrongAnswer !== correctAnswer) {
        newOptions.push(wrongAnswer);
      }
    }

    let currentCorrectIndex;
    do {
      // Shuffle options
      for (let i = newOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newOptions[i], newOptions[j]] = [newOptions[j], newOptions[i]];
      }
      currentCorrectIndex = newOptions.indexOf(correctAnswer);
    } while (currentCorrectIndex === lastCorrectIndex);

    lastCorrectIndex = currentCorrectIndex;
    setOptions(newOptions);
  };

  const handleAnswer = async (answer: number, player: number) => {
    if (isProcessingAnswer || selectedOption !== null) return;
    setIsProcessingAnswer(true);
    setSelectedOption(answer);
    setCurrentPlayer(player);

    const correctAnswer = currentQuestion.num1 * currentQuestion.num2;
    if (answer === correctAnswer) {
      if (player === 1) {
        setPlayer1Score((prevScore) => prevScore + 1);
      } else {
        setPlayer2Score((prevScore) => prevScore + 1);
      }
      setFeedback({ message: t.correct, player });
    } else {
      if (player === 1) {
        setPlayer2Score((prevScore) => prevScore + 1);
      } else {
        setPlayer1Score((prevScore) => prevScore + 1);
      }
      setFeedback({ message: `${t.incorrect} ${correctAnswer}`, player });
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFeedback({ message: "", player: null });
    setSelectedOption(null);
    setCurrentPlayer(null);
    generateNewQuestion();
    setIsProcessingAnswer(false);
  };

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const endGame = () => {
    return (
      (player1Score == maxQuestions || player2Score == maxQuestions) &&
      feedback.message === "" &&
      !isProcessingAnswer
    );
  };

  // Start screen
  if (!gameStarted) {
    return (
      <View
        style={[styles.container, { backgroundColor: currentTheme.background }]}
      >
        <TouchableOpacity
          style={[
            styles.optionsButton,
            { backgroundColor: currentTheme.primary },
          ]}
          onPress={() => setGameStarted(true)}
        >
          <Text
            style={[
              styles.optionsButtonText,
              { color: currentTheme.background },
            ]}
          >
            {t.startGame}
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Link
            style={[
              styles.optionsButton,
              { backgroundColor: currentTheme.primary },
            ]}
            href="/"
            asChild
          >
            <TouchableOpacity style={styles.homeButton}>
              <Text
                style={[
                  styles.optionsButtonText,
                  { color: currentTheme.background },
                ]}
              >
                {t.return}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  // Final screen
  if (endGame()) {
    const winner = player1Score > player2Score ? t.player1 : t.player2;
    return (
      <View
        style={[styles.container, { backgroundColor: currentTheme.background }]}
      >
        <View style={styles.finalScoreContainerVertical}>
          <View style={[styles.playerFinalContainer, styles.player1Flipped]}>
            <Text
              style={[
                styles.finalScoreText,
                {
                  fontSize: winner === t.player1 ? 92 : 60,
                  fontWeight: "bold",
                },
              ]}
            >
              {winner === t.player1 ? "🏆" : "😞"}
            </Text>
            <Text style={[styles.finalScoreText, { color: currentTheme.text }]}>
              {player1Score} / {maxQuestions}
            </Text>
          </View>
          <View style={styles.finalActionsContainerCentered}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                setGameStarted(false);
                setPlayer1Score(0);
                setPlayer2Score(0);
              }}
            >
              <Ionicons name="refresh" size={60} color={currentTheme.text} />
            </TouchableOpacity>
            <Link href="/" asChild>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="menu" size={60} color={currentTheme.text} />
              </TouchableOpacity>
            </Link>
          </View>
          <View style={styles.playerFinalContainer}>
            <Text
              style={[
                styles.finalScoreText,
                {
                  fontSize: winner === t.player2 ? 92 : 60,
                  fontWeight: "bold",
                },
              ]}
            >
              {winner === t.player2 ? "🏆" : "😞"}
            </Text>
            <Text style={[styles.finalScoreText, { color: currentTheme.text }]}>
              {player2Score} / {maxQuestions}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Link href="/" asChild>
          <TouchableOpacity style={styles.homeButton}>
            <Ionicons name="home-outline" size={24} color={currentTheme.text} />
          </TouchableOpacity>
        </Link>
      </View>

      {feedback.message && (
        <View style={styles.feedbackContainer}>
          <Text
            style={[
              styles.feedbackText,
              {
                backgroundColor:
                  feedback.message === t.correct
                    ? currentTheme.success
                    : currentTheme.error,
                color: currentTheme.text,
              },
              currentPlayer === 1 && styles.feedbackTextFlipped,
            ]}
          >
            {feedback.message}
          </Text>
        </View>
      )}

      <View style={styles.boardContainer}>
        {/* Player 1 */}
        <View style={[styles.playerSide, styles.player1Side]}>
          <Text style={[styles.score, { color: currentTheme.text }]}>
            {t.player1}: {player1Score}/{maxQuestions}
          </Text>
          <Text style={[styles.question, { color: currentTheme.text }]}>
            {currentQuestion.num1} × {currentQuestion.num2} = ?
          </Text>
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <View key={index} style={styles.optionWrapper}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor:
                        selectedOption === option && currentPlayer === 1
                          ? option ===
                            currentQuestion.num1 * currentQuestion.num2
                            ? currentTheme.success
                            : currentTheme.error
                          : currentTheme.card,
                    },
                  ]}
                  onPress={() => handleAnswer(option, 1)}
                >
                  <Text
                    style={[styles.optionText, { color: currentTheme.text }]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Player 2 */}
        <View style={[styles.playerSide, styles.player2Side]}>
          <Text style={[styles.score, { color: currentTheme.text }]}>
            {t.player2}: {player2Score}/{maxQuestions}
          </Text>
          <Text style={[styles.question, { color: currentTheme.text }]}>
            {currentQuestion.num1} × {currentQuestion.num2} = ?
          </Text>
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <View key={index} style={styles.optionWrapper}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor:
                        selectedOption === option && currentPlayer === 2
                          ? option ===
                            currentQuestion.num1 * currentQuestion.num2
                            ? currentTheme.success
                            : currentTheme.error
                          : currentTheme.card,
                    },
                  ]}
                  onPress={() => handleAnswer(option, 2)}
                >
                  <Text
                    style={[styles.optionText, { color: currentTheme.text }]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  boardContainer: {
    justifyContent: "space-between",
    width: "100%",
    height: "95%",
  },
  playerSide: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
  },
  player1Side: {
    transform: [{ rotate: "180deg" }],
  },
  player2Side: {
    transform: [{ rotate: "0deg" }],
  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  question: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 15,
    marginBottom: 20,
  },
  optionWrapper: {
    width: "45%",
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
    fontSize: 24,
    fontWeight: "bold",
  },
  homeButton: {
    padding: 10,
  },
  optionsButton: {
    width: 150,
    height: 55,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  optionsButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  finalScoreContainerVertical: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 20,
  },
  playerFinalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  player1Flipped: {
    transform: [{ rotate: "180deg" }],
  },
  finalScoreText: {
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 10,
  },
  finalActionsContainerCentered: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  iconButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackContainer: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -12 }],
  },
  feedbackText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    color: "#fff",
    width: "80%",
  },
  feedbackTextFlipped: {
    transform: [{ rotate: "180deg" }],
  },
});

export default CompetitionScreen;
