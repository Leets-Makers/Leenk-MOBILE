import AsyncStorage from '@react-native-async-storage/async-storage';

const JUST_SIGNED_UP_KEY = 'just_signed_up';

export const setJustSignedUp = async (value: boolean) => {
  await AsyncStorage.setItem(JUST_SIGNED_UP_KEY, value ? '1' : '0');
};

export const getJustSignedUp = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(JUST_SIGNED_UP_KEY);
  return value === '1';
};

export const clearJustSignedUp = async () => {
  await AsyncStorage.removeItem(JUST_SIGNED_UP_KEY);
};
