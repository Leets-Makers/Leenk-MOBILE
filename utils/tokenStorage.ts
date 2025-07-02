import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'access_token';

export const saveAccessToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getAccessToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const deleteAccessToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};
