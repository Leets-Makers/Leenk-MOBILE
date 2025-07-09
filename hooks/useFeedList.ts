import {
  getFeedList,
  getMyFeedList,
  getMyLinkedFeedList,
  getOtherUserFeedList,
  getOtherUserLinkedFeedList,
} from '@/api/feed/feed.api';
import { FeedItem } from '@/types/feed';
import { useToastStore } from '@/stores/toastStore';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

interface UseFeedListOptions {
  type: 'all' | 'myFeed' | 'myJoined' | 'userFeed' | 'userJoined';
  userId?: number; // userFeed, userJoined 일 때
  pageSize?: number;
}

export default function useFeedList({
  type,
  userId,
  pageSize = 10,
}: UseFeedListOptions) {
  const { showToast } = useToastStore();

  const fetchFeeds = async (pageNumber: number, pageSize: number) => {
    try {
      let data;
      switch (type) {
        case 'all':
          data = await getFeedList(pageNumber, pageSize);
          break;
        case 'myFeed':
          data = await getMyFeedList(pageNumber, pageSize);
          break;
        case 'myJoined':
          data = await getMyLinkedFeedList(pageNumber, pageSize);
          break;
        case 'userFeed':
          if (!userId) throw new Error('userId가 필요합니다');
          data = await getOtherUserFeedList(userId, pageNumber, pageSize);
          break;
        case 'userJoined':
          if (!userId) throw new Error('userId가 필요합니다');
          data = await getOtherUserLinkedFeedList(userId, pageNumber, pageSize);
          break;
        default:
          throw new Error('잘못된 피드 타입입니다');
      }

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
