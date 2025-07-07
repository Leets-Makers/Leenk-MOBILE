import { getUsersInfo } from '@/api/users/getUsersInfo.api';
import { useCallback, useState } from 'react';

export interface UserInfo {
  id: number;
  cardinal: number;
  name: string;
  position: 'FE' | 'BE' | 'D' | 'PM';
  profileImage: string;
  kakaoTalkId: string;
  introduction: string;
  mbti: string;
}

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserInfo = useCallback(async () => {
    if (loading) return;
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
  }, []);

  return { userInfo, loading, error, refetch: fetchUserInfo };
};
