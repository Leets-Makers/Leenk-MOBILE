import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getAccessToken } from '@/utils/tokenStorage';
import Splash from '@/components/Splash';
import LandingPage from '@/components/LandingPage';

export default function IndexPage() {
  const router = useRouter();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const token = await getAccessToken();
        if (token) {
          router.replace('/(page)/feed');
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
