import { getAccessToken } from '@react-native-kakao/user';
import axios from 'axios';

export const getUsersInfo = async () => {
  const token = await getAccessToken();

  const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};
