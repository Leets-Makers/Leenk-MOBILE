import { useEffect, useState } from 'react';
import { MBTI_LIST } from '@/constants/MbtiList';

export default function useRandomMbti(intervalTime: number = 2000) {
  const [randomMbti, setRandomMbti] = useState('ENFP');

  useEffect(() => {
    const interval = setInterval(() => {
      const random = MBTI_LIST[Math.floor(Math.random() * MBTI_LIST.length)];
      setRandomMbti(random);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [intervalTime]);

  return randomMbti;
}
