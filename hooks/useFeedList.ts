import { useEffect, useState } from 'react';
import { getFeedList } from '@/api/feed/feed.api';
import { FeedItem } from '@/types/feed';
import { useToastStore } from '@/stores/toastStore';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

export default function useFeedList(pageSize = 10) {
  const { showToast } = useToastStore();

  const fetchFeeds = async (pageNumber: number, pageSize: number) => {
    try {
      const data = await getFeedList(pageNumber, pageSize);
      console.log('피드 조회 응답 : ', data);
      return {
        data: data.feeds,
        pageable: data.pageable,
      };
    } catch (err: any) {
      console.error('피드 목록 조회 실패:', err);
      showToast('피드 목록 조회에 실패했어!', 'error');
      throw err;
    }
  };

  return useInfiniteScroll<FeedItem>({
    fetchFunction: fetchFeeds,
    pageSize,
  });
}
