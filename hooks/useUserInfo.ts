import { getUsersInfo } from '@/api/users/getUsersInfo.api';
import { useCallback, useState } from 'react';
import { getRefreshToken } from '@/utils/tokenStorage';

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

  const fetchUserInfo = useCallback(async () => {
    if (loading) return;

    const refreshToken = await getRefreshToken();
    if (!refreshToken) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getUsersInfo();
      setUserInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('유저 정보 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { userInfo, loading, error, refetch: fetchUserInfo };
};
