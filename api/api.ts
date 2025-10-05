import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
  clearAllTokens,
} from '@/utils/tokenStorage';
import { router } from 'expo-router';

import type { InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const setAuthHeader = (config: RetriableRequestConfig, token: string) => {
  const h = config.headers as any;

  // AxiosHeaders 인스턴스인 경우
  if (h && typeof h.set === 'function') {
    h.set('Authorization', `Bearer ${token}`);
    return;
  }

  // 그 외 재할당 금지, mutate만
  if (!config.headers) {
    // headers가 비어 있으면 먼저 객체를 만들어 준다
    (config as any).headers = {} as AxiosRequestHeaders;
  }
  (config.headers as any)['Authorization'] = `Bearer ${token}`;
};

// 토큰 리프레시 함수
const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  try {
    const response = await axios.post(`${BASE_URL}/refresh`, { refreshToken });

    // 토큰이 없으면 실패 처리
    const data = response?.data?.data;
    const accessToken = data?.accessToken;
    const newRefreshToken = data?.refreshToken;
    if (!accessToken || !newRefreshToken) {
      throw new Error('Refresh response missing tokens');
    }

    await saveAccessToken(accessToken);
    await saveRefreshToken(newRefreshToken);

    return accessToken;
  } catch (error) {
    console.error('[refreshAccessToken] 토큰 갱신 실패:', error);
    throw error;
  }
};

// 요청 인터셉터
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      setAuthHeader(config as RetriableRequestConfig, token);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
let isRefreshing = false;
type RefreshSubscriber = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let refreshSubscribers: RefreshSubscriber[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
};

const onTokenRefreshFailed = (error: unknown) => {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (subscriber: RefreshSubscriber) => {
  refreshSubscribers.push(subscriber);
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = (error.config || {}) as RetriableRequestConfig;

    // /refresh 에러는 루프 방지
    const fullUrl = `${originalRequest?.baseURL || ''}${originalRequest?.url || ''}`;
    if (fullUrl.includes('/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 이미 리프레시 중이면 큐에 대기 후 새 토큰으로 재시도
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber({
            resolve: (token: string) => {
              setAuthHeader(originalRequest, token);
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      // 최초 401: 리프레시 후 현재 요청 재시도
      isRefreshing = true;
      try {
        const newAccessToken = await refreshAccessToken();

        // 대기 중 요청들 깨우기
        onTokenRefreshed(newAccessToken);

        // 현재 요청 헤더 갱신 후 재시도
        setAuthHeader(originalRequest, newAccessToken);
        return api(originalRequest);
      } catch (err) {
        onTokenRefreshFailed(err);
        await clearAllTokens();
        router.replace('/');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
