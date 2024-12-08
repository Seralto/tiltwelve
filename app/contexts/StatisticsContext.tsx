import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STATISTICS_KEY = "@tiltwelve:statistics";

interface EquationStat {
  correct: number;
  total: number;
}

interface NumberStats {
  [key: string]: EquationStat; // key is in format "1x1", "1x2", etc.
}

interface Statistics {
  [key: number]: NumberStats; // key is the first number (1-12)
}

interface StatisticsContextType {
  statistics: Statistics;
  addAttempt: (num1: number, num2: number, isCorrect: boolean) => void;
  getPercentage: (num1: number, num2: number) => number;
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(
  undefined
);

export function StatisticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [statistics, setStatistics] = useState<Statistics>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load statistics when component mounts
  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const stored = await AsyncStorage.getItem(STATISTICS_KEY);
      if (stored) {
        setStatistics(JSON.parse(stored));
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading statistics:", error);
      setIsLoading(false);
    }
  };

  const saveStatistics = async (newStats: Statistics) => {
    try {
      await AsyncStorage.setItem(STATISTICS_KEY, JSON.stringify(newStats));
    } catch (error) {
      console.error("Error saving statistics:", error);
    }
  };

  const addAttempt = async (num1: number, num2: number, isCorrect: boolean) => {
    setStatistics((prev) => {
      // Create a deep copy of the previous state
      const newStats = JSON.parse(JSON.stringify(prev));

      // Initialize objects if they don't exist
      if (!newStats[num1]) {
        newStats[num1] = {};
      }

      const key = `${num1}x${num2}`;
      if (!newStats[num1][key]) {
        newStats[num1][key] = { correct: 0, total: 0 };
      }

      // Update statistics
      newStats[num1][key].total += 1;
      if (isCorrect) {
        newStats[num1][key].correct += 1;
      }

      // Save to AsyncStorage
      saveStatistics(newStats);

      return newStats;
    });
  };

  const getPercentage = (num1: number, num2: number): number => {
    const stats = statistics[num1]?.[`${num1}x${num2}`];
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.correct / stats.total) * 100);
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <StatisticsContext.Provider
      value={{ statistics, addAttempt, getPercentage }}
    >
      {children}
    </StatisticsContext.Provider>
  );
}

export function useStatistics() {
  const context = useContext(StatisticsContext);
  if (context === undefined) {
    throw new Error("useStatistics must be used within a StatisticsProvider");
  }
  return context;
}

export default StatisticsProvider;
