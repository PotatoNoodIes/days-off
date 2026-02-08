export default {
  expo: {
    name: 'app',
    slug: 'app',
    scheme: 'timesync',
    version: '1.0.0',
    orientation: 'portrait',
    //icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    // splash: {
    //   image: './assets/splash-icon.png',
    //   resizeMode: 'contain',
    //   backgroundColor: '#ffffff',
    // },
    ios: {
      supportsTablet: true,
    },
    android: {
      // adaptiveIcon: {
      //   foregroundImage: './assets/adaptive-icon.png',
      //   backgroundColor: '#ffffff',
      // },
      package: 'com.anonymous.app',
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    // web: {
    //   favicon: './assets/favicon.png',
    // },
    plugins: ['expo-secure-store'],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "32244e4b-7a73-4fde-af48-f46151be8c77"
      }
    },
  },
};