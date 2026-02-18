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
      softwareKeyboardLayoutMode: 'pan',
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
        projectId: "1b3d7b80-80d0-4888-82af-ef48cbc60404"
      }
    },
  },
};