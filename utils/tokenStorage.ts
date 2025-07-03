import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'access_token';

export const saveAccessToken = async (token: string) => {
  if (Platform.OS === 'web') {
    console.log('[웹 환경] 저장 안됨:', token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};
export const getAccessToken = async () => {
  if (Platform.OS === 'web') {
    console.warn('❗ SecureStore is not available on web');
    return null;
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const deleteAccessToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};
