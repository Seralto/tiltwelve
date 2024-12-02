# 🔢 TilTwelve

A beautiful and interactive multiplication tables learning app that makes math fun! Available in English, Portuguese, and Spanish.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-green.svg)
![React Native](https://img.shields.io/badge/React%20Native-v0.72-blue.svg)
![Expo](https://img.shields.io/badge/Expo-SDK%2049-black.svg)

## ✨ Features

- 📚 Study Mode
  - Interactive multiplication tables from 1 to 12
  - Toggle answer visibility for self-testing
  - Clean, modern interface

- 🎯 Quiz Modes
  - Input Mode: Type your answers
  - Multiple Choice: Choose from options
  - Immediate feedback and scoring

- 📊 Statistics
  - Track your progress
  - Performance metrics per table
  - Color-coded success rates

- 🌍 Multilingual
  - English (US)
  - Portuguese (BR)
  - Spanish (ES)

- 🎨 Themes
  - Light mode
  - Dark mode
  - Persistent preferences

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo Go app (for mobile testing)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/tiltwelve.git
   cd tiltwelve
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

4. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## 🛠 Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router
- AsyncStorage
- React Context API

## 📦 Building for Production

### Android (Play Store)

1. Install EAS CLI
   ```bash
   npm install -g eas-cli
   ```

2. Login to your Expo account
   ```bash
   eas login
   ```

3. Configure the build
   ```bash
   eas build:configure
   ```

4. Create a production build
   ```bash
   eas build --platform android --profile production
   ```

5. Submit to Play Store
   ```bash
   eas submit --platform android
   ```

Note: Make sure you have set up your Google Play Console account and have the necessary credentials.

## 📱 Screenshots

[Add your app screenshots here]

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Ionicons](https://ionic.io/ionicons)
- Built with [Expo](https://expo.dev)
- Inspired by educators and students worldwide

---

Made with ❤️ for making multiplication fun!
