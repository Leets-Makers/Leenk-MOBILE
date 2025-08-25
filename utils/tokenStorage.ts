import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const FCM_TOKEN_KEY = 'fcm_token';

const TEMP_ACCESS_TOKEN_KEY = 'temp_access_token';

// Access Token
export const saveAccessToken = async (token: string) => {
  if (Platform.OS === 'web') return;
  if (typeof token !== 'string') {
    console.error('[SecureStore] 저장 실패 - token이 문자열 아님:', token);
    return;
  }
  try {
    if (__DEV__) {
      console.log('[SecureStore] saveAccessToken 호출됨');
      console.log('[SecureStore] token 타입:', typeof token);
      console.log('[SecureStore] token 값:', token);
    }

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  } catch (err) {
    console.error('[SecureStore] accessToken 저장 중 에러 발생:', err);
    throw err;
  }
};

export const getAccessToken = async () => {
  if (Platform.OS === 'web') return null;
  return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const deleteAccessToken = async () => {
  if (Platform.OS === 'web') return;
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
};

// Refresh Token
export const saveRefreshToken = async (token: string) => {
  if (Platform.OS === 'web') return;

  try {
    if (__DEV__) {
      console.log('[SecureStore] saveRefreshToken 호출됨');
      console.log('[SecureStore] token 타입:', typeof token);
      console.log('[SecureStore] token 값:', token);
    }

    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (err) {
    console.error('[SecureStore] refreshToken 저장 중 에러 발생:', err);
    throw err;
  }
};

export const getRefreshToken = async () => {
  if (Platform.OS === 'web') return null;
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const deleteRefreshToken = async () => {
  if (Platform.OS === 'web') return;
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

// FCM Token
export const saveFcmToken = async (token: string) => {
  if (Platform.OS === 'web') return;
  await SecureStore.setItemAsync(FCM_TOKEN_KEY, token);
};

export const getFcmToken = async () => {
  if (Platform.OS === 'web') return null;
  return await SecureStore.getItemAsync(FCM_TOKEN_KEY);
};

export const deleteFcmToken = async () => {
  if (Platform.OS === 'web') return;
  await SecureStore.deleteItemAsync(FCM_TOKEN_KEY);
};

// Temp Access Token
export const saveTempAccessToken = async (token: string) => {
  if (Platform.OS === 'web') return;
  await SecureStore.setItemAsync(TEMP_ACCESS_TOKEN_KEY, token);
};

export const getTempAccessToken = async () => {
  if (Platform.OS === 'web') return null;
  return await SecureStore.getItemAsync(TEMP_ACCESS_TOKEN_KEY);
};

export const deleteTempAccessToken = async () => {
  if (Platform.OS === 'web') return;
  await SecureStore.deleteItemAsync(TEMP_ACCESS_TOKEN_KEY);
};

// Clear All
export const clearAllTokens = async () => {
  await deleteAccessToken();
  await deleteRefreshToken();
  await deleteFcmToken();
  await deleteTempAccessToken();
};
