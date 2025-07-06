import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const saveAccessToken = async (token: string) => {
  if (Platform.OS === 'web') return;
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = async () => {
  if (Platform.OS === 'web') return null;
  return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const deleteAccessToken = async () => {
  if (Platform.OS === 'web') return;
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
};

export const saveRefreshToken = async (token: string) => {
  if (Platform.OS === 'web') return;
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = async () => {
  if (Platform.OS === 'web') return null;
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const deleteRefreshToken = async () => {
  if (Platform.OS === 'web') return;
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

export const clearAllTokens = async () => {
  await deleteAccessToken();
  await deleteRefreshToken();
};
