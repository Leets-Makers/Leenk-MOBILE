import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getAccessToken } from '@react-native-kakao/user';
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
          console.log('자동 로그인 성공:', token);
          router.replace('/(page)/feed');
          return;
        }
      } catch (error) {
        console.error('자동 로그인 실패:', error);
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
