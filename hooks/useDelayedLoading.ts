import { useEffect, useState } from 'react';

interface UseDelayedLoadingOptions {
  // 로딩 UI를 보여주기 전 대기 시간
  // 기본값: 250ms
  delay?: number; // ms
}

/**
 * @param loading 실제 로딩 상태
 * @param options 지연 옵션 (delay)
 * @returns showLoading - 실제로 화면에 로딩 컴포넌트를 보여줄지 여부
 */

export function useDelayedLoading(
  loading: boolean,
  options: UseDelayedLoadingOptions = {},
) {
  const { delay = 250 } = options;
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    // 로딩 시작 시 (delay 이후에만 로딩 UI 표시)
    if (loading) {
      timer = setTimeout(() => {
        setShowLoading(true);
      }, delay);

      // 로딩 종료 시 (즉시 로딩 UI 제거)
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, delay]);

  return showLoading;
}
