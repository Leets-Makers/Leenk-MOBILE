import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Ap() {
  const [firstLaunch, setFirstLaunch] = useState(Boolean);
  useEffect(() => {
    AsyncStorage.getItem('launched').then((value) => {
      if (value == null) {
        AsyncStorage.setItem('launched', 'true');
        setFirstLaunch(true);
      } else {
        setFirstLaunch(false);
      }
    });
  }, []);

  return firstLaunch;
}
