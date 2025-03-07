import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../components/LoadingScreen";

export type Language = "en-US" | "pt-BR" | "es-ES";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const LANGUAGE_STORAGE_KEY = "@tiltwelve:language";

export const translations = {
  "en-US": {
    studyTitle: "Multiplication Tables",
    studyDescription: "Learn multiplication tables",
    quizTitle: "Quiz",
    quizDescription: "Test your knowledge",
    settings: "Settings",
    settingsDescription: "Customize language and theme",
    darkMode: "Dark Mode",
    language: "Language",
    takeQuiz: "Take a Quiz",
    backToStudy: "Back to Study",
    enterAnswer: "Enter your answer",
    submit: "Submit",
    score: "Score",
    tableScore: "Table {{table}} score",
    globalScore: "Global score",
    correct: "Correct! 🎉",
    incorrect: "Incorrect. The answer was",
    english: "English",
    portuguese: "Portuguese",
    spanish: "Spanish",
    selectQuizMode: "Select Quiz Mode",
    inputMode: "Input Mode",
    multipleChoiceMode: "Multiple Choice",
    inputModeDesc: "Type the answer manually",
    multipleChoiceModeDesc: "Select from options",
    nextQuestion: "Next Question",
    chooseAnswer: "Choose the correct answer",
    statistics: "Statistics",
    statisticsDescription: "Track your progress",
    table: "Table",
    allTables: "All",
    noAttempts: "No attempts",
    theme: "Theme",
    loading: "Loading...",
    about: "About Me",
    aboutDescription:
      "Hello! This is Sérgio Toledo from Brazil, I am a Software Engineer and passionate about programming. \n\nI created TilTwelve to help kids learn multiplication tables in a fun and interactive way.",
    switchToMultiple: "Switch to Multiple Choice",
    switchToInput: "Switch to Input Mode",
    competitionTitle: "Competition",
    competitionDescription: "Compete with a friend",
    player1: "Player 1",
    player2: "Player 2",
    correctAnswer: "Correct Answer",
    wrongAnswer: "Wrong Answer",
    startGame: "Start Game",
    finalScore: "Final Score",
    winner: "Winner",
    playAgain: "Play Again",
    return: "Return",
  },
  "pt-BR": {
    studyTitle: "Tabuadas",
    studyDescription: "Aprenda tabuadas",
    quizTitle: "Quiz",
    quizDescription: "Teste seu conhecimento",
    settings: "Configurações",
    settingsDescription: "Personalize idioma e tema",
    darkMode: "Modo Escuro",
    language: "Idioma",
    takeQuiz: "Fazer Quiz",
    backToStudy: "Voltar ao Estudo",
    enterAnswer: "Digite sua resposta",
    submit: "Enviar",
    score: "Pontuação",
    tableScore: "Pontuação da tabuada {{table}}",
    globalScore: "Pontuação global",
    correct: "Correto! 🎉",
    incorrect: "Incorreto. A resposta era",
    english: "Inglês",
    portuguese: "Português",
    spanish: "Espanhol",
    selectQuizMode: "Selecione o Modo do Quiz",
    inputMode: "Modo Digitação",
    multipleChoiceMode: "Múltipla Escolha",
    inputModeDesc: "Digite a resposta manualmente",
    multipleChoiceModeDesc: "Selecione entre as opções",
    nextQuestion: "Próxima Questão",
    chooseAnswer: "Escolha a resposta correta",
    statistics: "Estatísticas",
    statisticsDescription: "Acompanhe seu desempenho",
    table: "Tabuada",
    allTables: "Todas",
    noAttempts: "Sem tentativas",
    theme: "Tema",
    loading: "Carregando...",
    about: "Sobre Mim",
    aboutDescription:
      "Olá! Meu nome é Sérgio Toledo, sou Engenheiro de Software e apaixonado por programação. \n\nCriei o TilTwelve para ajudar crianças a aprenderem tabuadas de uma forma divertida e interativa.",
    switchToMultiple: "Mudar para Múltipla Escolha",
    switchToInput: "Mudar para Modo de Entrada",
    competitionTitle: "Competição",
    competitionDescription: "Compita com um amigo",
    player1: "Jogador 1",
    player2: "Jogador 2",
    correctAnswer: "Resposta Correta",
    wrongAnswer: "Resposta Errada",
    startGame: "Iniciar Jogo",
    finalScore: "Pontuação Final",
    winner: "Vencedor",
    playAgain: "Jogar Novamente",
    return: "Voltar",
  },
  "es-ES": {
    studyTitle: "Tablas de Multiplicar",
    studyDescription: "Aprende tablas de multiplicar",
    quizTitle: "Quiz",
    quizDescription: "Prueba tu conocimiento",
    settings: "Ajustes",
    settingsDescription: "Personaliza idioma y tema",
    darkMode: "Modo Oscuro",
    language: "Idioma",
    takeQuiz: "Hacer Quiz",
    backToStudy: "Volver al Estudio",
    enterAnswer: "Ingresa tu respuesta",
    submit: "Enviar",
    score: "Puntuación",
    tableScore: "Puntuación de la tabla {{table}}",
    globalScore: "Puntuación global",
    correct: "¡Correcto! 🎉",
    incorrect: "Incorrecto. La respuesta era",
    english: "Inglés",
    portuguese: "Portugués",
    spanish: "Español",
    selectQuizMode: "Seleccionar Modo de Quiz",
    inputMode: "Modo Entrada",
    multipleChoiceMode: "Opción Múltiple",
    inputModeDesc: "Escribe la respuesta manualmente",
    multipleChoiceModeDesc: "Selecciona entre opciones",
    nextQuestion: "Siguiente Pregunta",
    chooseAnswer: "Elige la respuesta correcta",
    statistics: "Estadísticas",
    statisticsDescription: "Sigue tu progreso",
    table: "Tabla",
    allTables: "Todas",
    noAttempts: "Sin intentos",
    theme: "Tema",
    loading: "Cargando...",
    about: "Sobre Mí",
    aboutDescription:
      "¡Hola! Soy Sérgio Toledo de Brasil, soy Ingeniero de Software y apasionado por la programación. \n\nCreé TilTwelve para ayudar a los niños a aprender las tablas de multiplicar de una manera divertida e interactiva.",
    switchToMultiple: "Cambiar a Opción Múltiple",
    switchToInput: "Cambiar a Modo de Entrada",
    competitionTitle: "Competencia",
    competitionDescription: "Compite con un amigo",
    player1: "Jugador 1",
    player2: "Jugador 2",
    correctAnswer: "Respuesta Correcta",
    wrongAnswer: "Respuesta Incorrecta",
    startGame: "Comenzar Juego",
    finalScore: "Puntuación Final",
    winner: "Ganador",
    playAgain: "Jugar de Nuevo",
    return: "Volver",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en-US");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (
        savedLanguage &&
        (savedLanguage === "en-US" ||
          savedLanguage === "pt-BR" ||
          savedLanguage === "es-ES")
      ) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error("Error loading language:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return {
    ...context,
    t: translations[context.language],
  };
}

export default LanguageProvider;
