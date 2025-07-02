import { getUsersInfo } from '@/api/users/getUsersInfo';
import { useEffect, useState } from 'react';

export interface UserInfo {
  cardinal: number;
  name: string;
  position: 'FE' | 'BE' | 'D' | 'PM';
}

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUsersInfo();
        setUserInfo(data);
      } catch (err: any) {
        setError(err);
        console.error('유저 정보 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { userInfo, loading, error };
};
