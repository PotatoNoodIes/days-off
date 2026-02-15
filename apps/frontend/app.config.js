export default {
  expo: {
    name: 'app',
    slug: 'app',
    scheme: 'timesync',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './admin/assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: false,
    splash: {
      image: './admin/assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.daysof.app',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './admin/assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.daysof.app',
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './admin/assets/favicon.png',
    },
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