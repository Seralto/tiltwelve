import { Stack } from 'expo-router';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen
            name="study"
            options={{
              title: 'TilTwelve',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="quiz-mode"
            options={{
              title: 'Quiz Mode',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="quiz"
            options={{
              title: 'Quiz',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="quiz-multiple"
            options={{
              title: 'Multiple Choice Quiz',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Settings',
              headerShown: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </LanguageProvider>
  );
}
