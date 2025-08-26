import { useCallback, useEffect, useRef, useState } from 'react';
import { Pageable, PageableResponse } from '@/types/pageable';

interface UseInfiniteScrollProps<T> {
  fetchFunction: (
    pageNumber: number,
    pageSize: number,
  ) => Promise<PageableResponse<T> & { totalReactionCount?: number }>; // api 호출 함수
  initialPageNumber?: number; // 처음 조회할 페이지 번호
  pageSize?: number; // 한 페이지에 불러올 데이터 갯수
}

export default function UseInfiniteScroll<T extends { feedId: number }>({
  fetchFunction,
  initialPageNumber = 0,
  pageSize = 10,
}: UseInfiniteScrollProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [pageable, setPageable] = useState<Pageable | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalReactionCount, setTotalReactionCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  // 다음에 요청할 페이지 번호 관리
  const nextPageRef = useRef<number>(initialPageNumber);

  // 에러 이후 자동 재호출을 막음
  const blockedRef = useRef<boolean>(false);

  const loadMore = useCallback(async () => {
    if (isLoading) return;
    if (blockedRef.current) return;
    if (pageable && !pageable.hasNext) return;

    setIsLoading(true);
    try {
      const pageNumber = pageable ? pageable.pageNumber + 1 : initialPageNumber;
      console.log('loadMore pageNumber:', pageNumber);
      const res = await fetchFunction(pageNumber, pageSize);

      setData((prev) => {
        const newData = res.data.filter(
          (item) => !prev.some((prevItem) => prevItem.feedId === item.feedId),
        );
        return [...prev, ...newData];
      });

      setPageable(res.pageable);
      if (res.totalReactionCount !== undefined) {
        setTotalReactionCount(res.totalReactionCount);
      }

      // 성공했을 때만 다음 페이지로 이동
      nextPageRef.current = pageNumber + 1;
      setHasError(false);
    } catch (error) {
      // 에러 시에는 차단 플래그를 켜서 자동 재호출 방지
      blockedRef.current = true;
      setHasError(true);
      console.error('무한 스크롤 에러 :', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, pageable, isLoading, pageSize, initialPageNumber]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      blockedRef.current = false;
      // nextPageRef.current = initialPageNumber;

      console.log('refresh pageNumber:', initialPageNumber);
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
