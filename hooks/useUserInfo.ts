import { getUsersInfo } from '@/api/users/getUsersInfo.api';
import { useCallback, useRef, useState } from 'react';
import { getRefreshToken, clearAllTokens } from '@/utils/tokenStorage';
import { useRouter } from 'expo-router';
import axios from 'axios';

export interface UserInfo {
  userId: number;
  name: string;

  cardinal?: number | null;
  position?: 'FE' | 'BE' | 'D' | 'PM' | null;
  thumbnail?: string | null;
  kakaoTalkId?: string | null;
  introduction?: string | null;
  mbti?: string | null;
  birthday?: string | null;
  isUserBirthdayToday: boolean;
}

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const loadingRef = useRef(false);

  const fetchUserInfo = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      loadingRef.current = false;
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUsersInfo();
      setUserInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('유저 정보 불러오기 실패:', err);

      // 유저 정보가 없는 경우 토큰 삭제 및 로그아웃 처리
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        console.log('유저 정보 없음 (404) - 로그아웃 처리');
        await clearAllTokens();
        router.replace('/');
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [router]);

  return { userInfo, loading, error, refetch: fetchUserInfo };
};
