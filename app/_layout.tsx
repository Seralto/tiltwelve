import { Stack, useRouter } from "expo-router";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { StatisticsProvider } from "./contexts/StatisticsContext";
import { useEffect } from "react";

function InitialRedirect() {
  const router = useRouter();
  const { theme } = useTheme();
  const { language } = useLanguage();

  useEffect(() => {
    // Check if theme and language are set
    if (!theme || !language) {
      router.replace("/settings");
    }
  }, [theme, language]);

  return null;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <StatisticsProvider>
          <InitialRedirect />
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="study"
              options={{
                title: "TilTwelve",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="quiz-mode"
              options={{
                title: "Quiz Mode",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="quiz"
              options={{
                title: "Quiz",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="quiz-multiple"
              options={{
                title: "Multiple Choice Quiz",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                title: "Settings",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="statistics"
              options={{
                title: "Statistics",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="about"
              options={{
                title: "About",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="competition"
              options={{
                title: "Competition",
                headerShown: false,
              }}
            />
          </Stack>
        </StatisticsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
