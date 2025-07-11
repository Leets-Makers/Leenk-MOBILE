import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useFirstLaunch() {
  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('launched');
        if (value == null) {
          await AsyncStorage.setItem('launched', 'true');
          setFirstLaunch(true);
        } else {
          setFirstLaunch(false);
        }
      } catch (error) {
        console.warn('Failed to check first launch status:', error);
        // 에러 발생 시 기본값으로 false 설정
        setFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  return firstLaunch;
}

export function useDetailFirstLaunch() {
  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('detailLaunched');
        if (value == null) {
          await AsyncStorage.setItem('detailLaunched', 'true');
          setFirstLaunch(true);
        } else {
          setFirstLaunch(false);
        }
      } catch (error) {
        console.warn('Failed to check first launch status:', error);
        setFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  return firstLaunch;
}
