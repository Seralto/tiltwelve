import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../components/LoadingScreen';

export type Language = 'en-US' | 'pt-BR' | 'es-ES';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@tiltwelve:language';

export const translations = {
  'en-US': {
    studyTitle: 'Study Multiplication Tables',
    quizTitle: 'Multiplication Quiz',
    settings: 'Settings',
    darkMode: 'Dark Mode',
    language: 'Language',
    takeQuiz: 'Take a Quiz',
    backToStudy: 'Back to Study',
    enterAnswer: 'Enter your answer',
    submit: 'Submit',
    score: 'Score',
    correct: 'Correct! 🎉',
    incorrect: 'Incorrect. The answer was',
    english: 'English',
    portuguese: 'Portuguese',
    spanish: 'Spanish',
    selectQuizMode: 'Select Quiz Mode',
    inputMode: 'Input Mode',
    multipleChoiceMode: 'Multiple Choice',
    inputModeDesc: 'Type the answer manually',
    multipleChoiceModeDesc: 'Select from options',
    nextQuestion: 'Next Question',
    chooseAnswer: 'Choose the correct answer',
  },
  'pt-BR': {
    studyTitle: 'Estude a Tabuada',
    quizTitle: 'Quiz de Multiplicação',
    settings: 'Configurações',
    darkMode: 'Modo Escuro',
    language: 'Idioma',
    takeQuiz: 'Fazer Quiz',
    backToStudy: 'Voltar ao Estudo',
    enterAnswer: 'Digite sua resposta',
    submit: 'Enviar',
    score: 'Pontuação',
    correct: 'Correto! 🎉',
    incorrect: 'Incorreto. A resposta era',
    english: 'Inglês',
    portuguese: 'Português',
    spanish: 'Espanhol',
    selectQuizMode: 'Selecione o Modo do Quiz',
    inputMode: 'Modo Digitação',
    multipleChoiceMode: 'Múltipla Escolha',
    inputModeDesc: 'Digite a resposta manualmente',
    multipleChoiceModeDesc: 'Selecione entre as opções',
    nextQuestion: 'Próxima Questão',
    chooseAnswer: 'Escolha a resposta correta',
  },
  'es-ES': {
    studyTitle: 'Estudia las Tablas de Multiplicar',
    quizTitle: 'Prueba de Multiplicación',
    settings: 'Configuración',
    darkMode: 'Modo Oscuro',
    language: 'Idioma',
    takeQuiz: 'Hacer Prueba',
    backToStudy: 'Volver al Estudio',
    enterAnswer: 'Ingresa tu respuesta',
    submit: 'Enviar',
    score: 'Puntaje',
    correct: '¡Correcto! 🎉',
    incorrect: 'Incorrecto. La respuesta era',
    english: 'Inglés',
    portuguese: 'Portugués',
    spanish: 'Español',
    selectQuizMode: 'Seleccionar Modo de Prueba',
    inputMode: 'Modo de Entrada',
    multipleChoiceMode: 'Opción Múltiple',
    inputModeDesc: 'Escribe la respuesta manualmente',
    multipleChoiceModeDesc: 'Selecciona entre opciones',
    nextQuestion: 'Siguiente Pregunta',
    chooseAnswer: 'Elige la respuesta correcta',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en-US');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'en-US' || savedLanguage === 'pt-BR' || savedLanguage === 'es-ES')) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.error('Error saving language:', error);
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
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return {
    ...context,
    t: translations[context.language],
  };
}