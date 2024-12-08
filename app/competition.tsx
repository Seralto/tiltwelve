import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme, themes } from "./contexts/ThemeContext";
import { useLanguage } from "./contexts/LanguageContext";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const CompetitionScreen = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const { t } = useLanguage();
  const navigation = useNavigation();

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({ num1: 8, num2: 4 });
  const [options, setOptions] = useState([32, 28, 21, 36]);
  const [currentPlayer, setCurrentPlayer] = useState(1);

  const generateNewQuestion = () => {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    setCurrentQuestion({ num1, num2 });
    const correctAnswer = num1 * num2;
    const newOptions = [correctAnswer];
    while (newOptions.length < 4) {
      const wrongAnswer = Math.floor(Math.random() * 144) + 1;
      if (!newOptions.includes(wrongAnswer) && wrongAnswer !== correctAnswer) {
        newOptions.push(wrongAnswer);
      }
    }
    setOptions(newOptions.sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (answer: number) => {
    const correctAnswer = currentQuestion.num1 * currentQuestion.num2;
    if (answer === correctAnswer) {
      if (currentPlayer === 1) {
        setPlayer1Score((prevScore) => prevScore + 1);
      } else {
        setPlayer2Score((prevScore) => prevScore + 1);
      }
    } else {
      if (currentPlayer === 1) {
        setPlayer2Score((prevScore) => prevScore + 1);
      } else {
        setPlayer1Score((prevScore) => prevScore + 1);
      }
    }
    setCurrentPlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1));
    generateNewQuestion();
  };

  useEffect(() => {
    generateNewQuestion();
  }, []);

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
      <View style={[styles.playerContainer, { flexDirection: "column" }]}>
        <View
          style={[
            styles.playerSide,
            styles.player1Side,
            { backgroundColor: currentTheme.card },
          ]}
        >
          <Text style={[styles.score, { color: currentTheme.text }]}>
            Player 1: {player1Score}
          </Text>
          <Text style={[styles.question, { color: currentTheme.text }]}>
            {currentQuestion.num1} × {currentQuestion.num2} = ?
          </Text>
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <View key={index} style={styles.optionWrapper}>
                <TouchableOpacity
                  style={[styles.optionButton, { backgroundColor: currentTheme.card }]}
                  onPress={() => handleAnswer(option)}
                >
                  <Text style={[styles.optionText, { color: currentTheme.text }]}>{option}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
        <View
          style={[
            styles.playerSide,
            styles.player2Side,
            { backgroundColor: currentTheme.card },
          ]}
        >
          <Text style={[styles.score, { color: currentTheme.text }]}>
            Player 2: {player2Score}
          </Text>
          <Text style={[styles.question, { color: currentTheme.text }]}>
            {currentQuestion.num1} × {currentQuestion.num2} = ?
          </Text>
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <View key={index} style={styles.optionWrapper}>
                <TouchableOpacity
                  style={[styles.optionButton, { backgroundColor: currentTheme.card }]}
                  onPress={() => handleAnswer(option)}
                >
                  <Text style={[styles.optionText, { color: currentTheme.text }]}>{option}</Text>
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
  playerContainer: {
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
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
});

export default CompetitionScreen;
