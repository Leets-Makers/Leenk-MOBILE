// 상세 피드에서 수직 스크롤을 위해 분리한 컴포넌트

import { FlatList, Dimensions, View } from 'react-native';
import { useEffect, useRef, useState, useCallback } from 'react';
import FeedDetailItem from './FeedDetailItem';
import { getFeedDetail } from '@/api/feed/feed.api';
import { FeedDetail } from '@/types/feed';
import { Loading } from '@/components';

interface FeedDetailListProps {
  initialFeedId: number;
}

export default function FeedDetailList({ initialFeedId }: FeedDetailListProps) {
  const [feeds, setFeeds] = useState<FeedDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const SCREEN_HEIGHT = Dimensions.get('screen').height;
  const flatListRef = useRef<FlatList>(null);

  // 초기 피드 3개 불러오기
  const fetchInitialFeeds = async () => {
    try {
      setIsLoading(true);
      const [prevFeed, currentFeed, nextFeed] = await Promise.all([
        getFeedDetail(initialFeedId - 1).catch(() => null),
        getFeedDetail(initialFeedId),
        getFeedDetail(initialFeedId + 1).catch(() => null),
      ]);

      setFeeds(
        [currentFeed, prevFeed, nextFeed].filter(Boolean) as FeedDetail[],
      );
    } catch (error) {
      console.error('피드 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialFeeds();
  }, [initialFeedId]);

  // 새 피드 추가 요청 함수
  const fetchFeedAtIndex = useCallback(
    async (index: number, feedId: number) => {
      try {
        const newFeed = await getFeedDetail(feedId);
        const newFeeds = [...feeds];
        newFeeds.splice(index, 0, newFeed); // 해당 위치에 삽입
        setFeeds(newFeeds);
      } catch (error) {
        console.error('피드 추가 조회 실패:', error);
      }
    },
    [feeds],
  );

  // 스크롤 끝났을 때 실행
  const handleMomentumScrollEnd = async (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const currentIndex = Math.round(offsetY / SCREEN_HEIGHT);

    // 이미 해당 index에 데이터가 있으면 리턴
    if (feeds[currentIndex]) return;

    // 기준 피드 id를 찾음 (앞/뒤 기준)
    const prevFeedId = feeds[currentIndex - 1]?.feedId;
    const nextFeedId = feeds[currentIndex + 1]?.feedId;

    // 방향에 따라 id 계산
    if (currentIndex === 0 && prevFeedId) {
      // 위로 스크롤한 경우
      await fetchFeedAtIndex(0, prevFeedId - 1);
    } else if (currentIndex === feeds.length - 1 && nextFeedId) {
      // 아래로 스크롤한 경우
      await fetchFeedAtIndex(feeds.length, nextFeedId + 1);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <FlatList
      ref={flatListRef}
      data={feeds}
      keyExtractor={(item) => item.feedId.toString()}
      pagingEnabled
      snapToInterval={SCREEN_HEIGHT}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      getItemLayout={(_, index) => ({
        length: SCREEN_HEIGHT,
        offset: SCREEN_HEIGHT * index,
        index,
      })}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      renderItem={({ item }) => (
        <View style={{ height: SCREEN_HEIGHT }}>
          <FeedDetailItem feed={item} />
        </View>
      )}
    />
  );
}
