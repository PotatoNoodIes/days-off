import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const MAX_SIZE = 2000; // SecureStore limit is 2048, use a safe margin

const ChunkedSecureStore = {
  getItem: async (key: string): Promise<string | null> => {
    const mainValue = await SecureStore.getItemAsync(key);
    if (!mainValue) return null;

    if (mainValue.startsWith('__chunked__')) {
      const chunkCount = parseInt(mainValue.split(':')[1], 10);
      let fullValue = '';
      for (let i = 0; i < chunkCount; i++) {
        const chunk = await SecureStore.getItemAsync(`${key}_chunk_${i}`);
        if (!chunk) return null;
        fullValue += chunk;
      }
      return fullValue;
    }

    return mainValue;
  },

  setItem: async (key: string, value: string): Promise<void> => {
    if (value.length > MAX_SIZE) {
      const chunks = [];
      for (let i = 0; i < value.length; i += MAX_SIZE) {
        chunks.push(value.substring(i, i + MAX_SIZE));
      }

      await SecureStore.setItemAsync(key, `__chunked__:${chunks.length}`);
      for (let i = 0; i < chunks.length; i++) {
        await SecureStore.setItemAsync(`${key}_chunk_${i}`, chunks[i]);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    const mainValue = await SecureStore.getItemAsync(key);
    if (mainValue?.startsWith('__chunked__')) {
      const chunkCount = parseInt(mainValue.split(':')[1], 10);
      await SecureStore.deleteItemAsync(key);
      for (let i = 0; i < chunkCount; i++) {
        await SecureStore.deleteItemAsync(`${key}_chunk_${i}`);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ChunkedSecureStore as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
