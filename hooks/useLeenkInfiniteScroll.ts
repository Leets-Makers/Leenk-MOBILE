import { useCallback, useEffect, useRef, useState } from 'react';
import { Pageable, PageableResponse } from '@/types/pageable';

interface UseLeenkInfiniteScrollProps<T> {
  fetchFunction: (
    pageNumber: number,
    pageSize: number,
  ) => Promise<PageableResponse<T> & { totalReactionCount?: number }>;
  initialPageNumber?: number;
  pageSize?: number;
}

export default function useLeenkInfiniteScroll<T extends { leenkId: number }>({
  fetchFunction,
  initialPageNumber = 0,
  pageSize = 10,
}: UseLeenkInfiniteScrollProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [pageable, setPageable] = useState<Pageable | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalReactionCount, setTotalReactionCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  // 다음 요청 페이지/에러 차단 플래그
  const nextPageRef = useRef<number>(initialPageNumber);
  const blockedRef = useRef<boolean>(false);

  const loadMore = useCallback(async () => {
    if (isLoading) return;
    if (blockedRef.current) return;
    if (pageable && !pageable.hasNext) return;

    setIsLoading(true);
    try {
      const pageNumber = pageable ? pageable.pageNumber + 1 : initialPageNumber;
      const res = await fetchFunction(pageNumber, pageSize);

      setData((prev) => {
        const newData = res.data.filter(
          (item) => !prev.some((p) => p.leenkId === item.leenkId),
        );
        return [...prev, ...newData];
      });

      setPageable(res.pageable);
      if (res.totalReactionCount !== undefined) {
        setTotalReactionCount(res.totalReactionCount);
      }

      nextPageRef.current = pageNumber + 1;
      setHasError(false);
    } catch (error) {
      blockedRef.current = true; // 에러 후 무한 재호출 방지
      setHasError(true);
      console.error('무한 스크롤 에러:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, pageable, isLoading, pageSize, initialPageNumber]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      blockedRef.current = false;

      const res = await fetchFunction(initialPageNumber, pageSize);
      setData(res.data);
      setPageable(res.pageable);
      if (res.totalReactionCount !== undefined) {
        setTotalReactionCount(res.totalReactionCount);
      }
      setHasError(false);
    } catch (error) {
      console.error('무한 스크롤 Refresh 에러:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchFunction, initialPageNumber, pageSize]);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
