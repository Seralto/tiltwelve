import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../components/LoadingScreen';

export type Theme = 'light' | 'dark' | 'kids';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@tiltwelve:theme';

export const themes = {
  light: {
    primary: '#007AFF',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#333333',
    secondary: '#666666',
    border: '#eeeeee',
    buttonText: '#333333', 
    error: '#FF3B30',
    success: '#34C759',
  },
  dark: {
    primary: '#0A84FF',
    background: '#1a1a1a',
    card: '#2a2a2a',
    text: '#ffffff',
    secondary: '#999999',
    border: '#404040',
    buttonText: '#ffffff', 
    error: '#FF453A',
    success: '#32D74B',
  },
  kids: {
    primary: '#CB8CFF',
    background: '#E2F0CB',
    card: '#FFFFFF',
    text: '#6B5876',
    secondary: '#CB8CFF',
    border: '#C7CEEA',
    buttonText: '#6B5876',
    error: '#FFB7B2',
    success: '#B5EAD7',
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'kids')) {
        setTheme(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetTheme = async (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
