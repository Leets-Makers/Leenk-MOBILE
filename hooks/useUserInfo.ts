import { getUsersInfo } from '@/api/users/getUsersInfo.api';
import { useEffect, useState } from 'react';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const data = await getUsersInfo();
      setUserInfo(data);
    } catch (err: any) {
      setError(err);
      console.error('유저 정보 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return { userInfo, loading, error, refetch: fetchUserInfo };
};
