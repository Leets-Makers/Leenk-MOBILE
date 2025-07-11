import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 공통 로직: key만 다르게 주입받아 처리
 */
function useFirstLaunchBase(storageKey: string) {
  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem(storageKey);
        if (value == null) {
          await AsyncStorage.setItem(storageKey, 'true');
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
  }, [storageKey]); // storageKey 변경에 대응할 수 있게 의존성 추가

  return firstLaunch;
}

/**
 * 실제 사용하는 훅들
 */
export default function useFirstLaunch() {
  return useFirstLaunchBase('launched');
}

export function useDetailFirstLaunch() {
  return useFirstLaunchBase('detailLaunched');
}
