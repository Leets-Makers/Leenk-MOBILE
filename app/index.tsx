import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getAccessToken } from '@/utils/tokenStorage';
import Splash from '@/components/Splash';
import LandingPage from '@/components/LandingPage';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
}

const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (e) {
    return true; // 디코드 실패 시 만료된 것으로 간주
  }
};

export default function IndexPage() {
  const router = useRouter();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const token = await getAccessToken();
        if (token && !isTokenExpired(token)) {
          router.replace('/(page)/leenk');
          return;
        }
      } catch (error) {
        if (__DEV__) {
          console.error('자동 로그인 실패:', error);
        }
      }

      setIsSplashVisible(false);
    };

    checkLogin();
  }, []);

  if (isSplashVisible) {
    return <Splash />;
  }

  return <LandingPage />;
}
