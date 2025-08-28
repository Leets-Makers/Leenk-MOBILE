import { useCallback, useEffect, useRef, useState } from 'react';
import { Pageable, PageableResponse } from '@/types/pageable';

interface UseLeenkInfiniteScrollProps<T> {
  fetchFunction: (
    pageNumber: number,
    pageSize: number,
  ) => Promise<PageableResponse<T> & { totalReactionCount?: number }>;
  initialPageNumber?: number;
  pageSize?: number;
  enabled?: boolean; // 조건부 활성화
}

export default function useLeenkInfiniteScroll<T extends { leenkId: number }>({
  fetchFunction,
  initialPageNumber = 0,
  pageSize = 10,
  enabled = true,
}: UseLeenkInfiniteScrollProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [pageable, setPageable] = useState<Pageable | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalReactionCount, setTotalReactionCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  // 에러 후 자동 재호출 차단 플래그
  const blockedRef = useRef<boolean>(false);
  const inFlightRef = useRef<boolean>(false);

  const loadMore = useCallback(async () => {
    if (!enabled) return;
    if (inFlightRef.current) return;
    if (isLoading) return;
    if (blockedRef.current) return;
    if (pageable && !pageable.hasNext) return;

    setIsLoading(true);
    inFlightRef.current = true;
    try {
      const pageNumber = pageable ? pageable.pageNumber + 1 : initialPageNumber;
      const res = await fetchFunction(pageNumber, pageSize);

      setData((prev) => {
        const newItems = res.data.filter(
          (item) => !prev.some((p) => p.leenkId === item.leenkId),
        );
        return [...prev, ...newItems];
      });

      setPageable(res.pageable);
      if (res.totalReactionCount !== undefined) {
        setTotalReactionCount(res.totalReactionCount);
      }
      setHasError(false);
    } catch (error) {
      blockedRef.current = true;
      setHasError(true);
      console.error('무한 스크롤 에러:', error);
    } finally {
      setIsLoading(false);
      inFlightRef.current = false;
    }
  }, [
    enabled,
    fetchFunction,
    pageable,
    isLoading,
    pageSize,
    initialPageNumber,
  ]);

  const refresh = useCallback(async () => {
    if (!enabled) return;

    setIsRefreshing(true);
    blockedRef.current = false;
    inFlightRef.current = false;

    try {
      const res = await fetchFunction(initialPageNumber, pageSize);
      setData(res.data);
      setPageable(res.pageable);
      if (res.totalReactionCount !== undefined) {
        setTotalReactionCount(res.totalReactionCount);
      }
      setHasError(false);
    } catch (error) {
      setHasError(true);
      console.error('무한 스크롤 Refresh 에러:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [enabled, fetchFunction, initialPageNumber, pageSize]);

  useEffect(() => {
    if (enabled) refresh();
  }, [enabled, refresh]);

  return {
    data,
    totalReactionCount,
    loadMore,
    isLoading,
    isRefreshing,
    refresh,
    hasError,
  };
}
