import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATISTICS_KEY = '@tiltwelve:statistics';

interface EquationStat {
  correct: number;
  total: number;
}

interface NumberStats {
  [key: string]: { // key is in format "1x1", "1x2", etc.
    correct: number;
    total: number;
  };
}

interface Statistics {
  [key: number]: NumberStats; // key is the first number (1-12)
}

interface StatisticsContextType {
  statistics: Statistics;
  addAttempt: (num1: number, num2: number, isCorrect: boolean) => void;
  getPercentage: (num1: number, num2: number) => number;
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

export function StatisticsProvider({ children }: { children: React.ReactNode }) {
  const [statistics, setStatistics] = useState<Statistics>({});

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const stored = await AsyncStorage.getItem(STATISTICS_KEY);
      if (stored) {
        setStatistics(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const saveStatistics = async (newStats: Statistics) => {
    try {
      await AsyncStorage.setItem(STATISTICS_KEY, JSON.stringify(newStats));
    } catch (error) {
      console.error('Error saving statistics:', error);
    }
  };

  const addAttempt = (num1: number, num2: number, isCorrect: boolean) => {
    setStatistics(prev => {
      const newStats = { ...prev };
      if (!newStats[num1]) {
        newStats[num1] = {};
      }
      const key = `${num1}x${num2}`;
      if (!newStats[num1][key]) {
        newStats[num1][key] = { correct: 0, total: 0 };
      }
      newStats[num1][key].total++;
      if (isCorrect) {
        newStats[num1][key].correct++;
      }
      saveStatistics(newStats);
      return newStats;
    });
  };

  const getPercentage = (num1: number, num2: number): number => {
    const stats = statistics[num1]?.[`${num1}x${num2}`];
    if (!stats || stats.total === 0) return 0;
    return (stats.correct / stats.total) * 100;
  };

  return (
    <StatisticsContext.Provider value={{ statistics, addAttempt, getPercentage }}>
      {children}
    </StatisticsContext.Provider>
  );
}

export function useStatistics() {
  const context = useContext(StatisticsContext);
  if (context === undefined) {
    throw new Error('useStatistics must be used within a StatisticsProvider');
  }
  return context;
}
