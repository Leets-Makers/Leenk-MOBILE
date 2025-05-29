import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

let refreshTokenPromise: Promise<any> | null = null;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 리프레시 토큰으로 accessToken 갱신
const getRefreshToken = async () => {
  try {
    const response = await api.post('/api/v1/users/refresh');
    if (response.data.code === 200) {
      const { accessToken, refreshToken } = response.data.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      return { newAccessToken: accessToken, newRefreshToken: refreshToken };
    }
    throw new Error('리프레시 토큰 재발급 실패');
  } catch (error) {
    console.error('리프레시 토큰 오류:', error);
    throw error;
  }
};

// 요청 인터셉터
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    const newHeaders = new AxiosHeaders(config.headers || {});

    if (accessToken) {
      newHeaders.set('Authorization', `Bearer ${accessToken}`);
    }
    if (refreshToken) {
      newHeaders.set('Authorization_refresh', `Bearer ${refreshToken}`);
    }

    return { ...config, headers: newHeaders };
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshTokenPromise) {
        refreshTokenPromise = getRefreshToken();
      }

      try {
        const { newAccessToken, newRefreshToken } = await refreshTokenPromise;
        refreshTokenPromise = null;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization_refresh = `Bearer ${newRefreshToken}`;
        return api(originalRequest);
      } catch (err) {
        refreshTokenPromise = null;
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');

        // TODO: 로그인 페이지로 리다이렉션
        Alert.alert('세션 만료', '다시 로그인해주세요.');
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
