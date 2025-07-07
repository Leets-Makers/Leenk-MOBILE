import { useEffect, useState } from 'react';
import { getFeedList } from '@/api/feed/feed.api';
import { FeedItem } from '@/types/feed';
import { useToastStore } from '@/stores/toastStore';

export default function useFeedList(page = 0, pageSize = 10) {
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastStore();

  useEffect(() => {
    const fetchFeeds = async () => {
      setIsLoading(true);

      try {
        const data = await getFeedList(page, pageSize);
        console.log('피드 조회 응답 : ', data);
        setFeeds(data);
      } catch (err: any) {
        console.error('피드 목록 조회 실패:', err);
        showToast('피드 목록 조회에 실패했어!', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeeds();
  }, [page, pageSize]);

  return { feeds, isLoading };
}
