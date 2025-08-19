import { useCallback, useEffect, useState } from 'react';
import { Pageable, PageableResponse } from '@/types/pageable';
import { isAxiosError } from 'axios';

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

  const loadMore = useCallback(async () => {
    if (isLoading) return;
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
    } catch (error) {
      console.error('무한 스크롤 에러 :', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, pageable, isLoading, pageSize, initialPageNumber]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      console.log('refresh pageNumber:', initialPageNumber);
      const res = await fetchFunction(initialPageNumber, pageSize);
      setData(res.data);
      setPageable(res.pageable);
      if (res.totalReactionCount !== undefined) {
        setTotalReactionCount(res.totalReactionCount);
      }
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
  };
}
