// 상세 피드에서 수직 스크롤을 위해 분리한 컴포넌트

import { FlatList, Dimensions, View, ViewToken } from 'react-native';
import { useEffect, useRef, useState, useCallback } from 'react';
import FeedDetailItem from './FeedDetailItem';
import { getFeedNavigation } from '@/api/feed/feed.api';
import { FeedNavigationItem } from '@/types/feed';
import { Loading } from '@/components';
import { router } from 'expo-router';

interface FeedDetailListProps {
  initialFeedId: number;
}

// FeedNavigationItem을 FeedDetail 형태로 변환하는 헬퍼 함수
const transformFeedItem = (item: any) => {
  // author 정보 안전하게 추출
  const authorData =
    item.author?.author || // author.author 구조
    item.author?.Author || // author.Author 구조
    item.author || // author 직접
    {};

  // linkedUser 안전하게 변환
  const linkedUserList = Array.isArray(item.linkedUser)
    ? item.linkedUser.map((lu: any) => {
        const userData =
          lu.user || // user 구조
          lu.User || // User 구조
          lu.author || // author 구조
          lu.Author || // Author 구조
          {};

        return {
          userId: userData.userId || userData.id || 0,
          name: userData.name || '사용자',
          profileImage: userData.thumbnail || userData.profileImage || '',
          isAuthor: lu.isAuthor || false,
          isUserBirthdayToday: userData.isUserBirthdayToday || false,
        };
      })
    : [];

  return {
    feedId: item.feedId,
    author: {
      userId: authorData.userId || authorData.id || 0,
      name: authorData.name || '사용자',
      profileImage: authorData.thumbnail || authorData.profileImage || '',
      isUserBirthdayToday: authorData.isUserBirthdayToday || false,
    },
    description: item.description || '',
    totalReactionCount: item.totalReactionCount || 0,
    createdAt: item.createdAt || '',
    media: item.media || [],
    linkedUserCount: item.linkedUserCount || 0,
    linkedUser: linkedUserList,
  };
};

export default function FeedDetailList({ initialFeedId }: FeedDetailListProps) {
  const [feeds, setFeeds] = useState<ReturnType<typeof transformFeedItem>[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasMorePrev, setHasMorePrev] = useState(false);
  const [hasMoreNext, setHasMoreNext] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const SCREEN_HEIGHT = Dimensions.get('screen').height;
  const flatListRef = useRef<FlatList>(null);
  const currentIndexRef = useRef(0);

  // 초기 피드 네비게이션 불러오기
  const fetchInitialFeeds = async () => {
    try {
      setIsLoading(true);
      const navigation = await getFeedNavigation(initialFeedId);

      // prevFeeds(역순) + current + nextFeeds 순서로 배열 구성
      const allFeeds = [
        ...navigation.prevFeeds.reverse().map(transformFeedItem),
        transformFeedItem(navigation.current),
        ...navigation.nextFeeds.map(transformFeedItem),
      ];

      setFeeds(allFeeds);
      setHasMorePrev(navigation.hasMorePrev);
      setHasMoreNext(navigation.hasMoreNext);

      // 초기 인덱스는 current의 위치 (prevFeeds 개수만큼 오프셋)
      currentIndexRef.current = navigation.prevFeeds.length;
    } catch (error) {
      console.error('피드 네비게이션 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialFeeds();
  }, [initialFeedId]);

  // 이전 피드들 추가 로드 (위로 스크롤)
  const loadMorePrev = useCallback(async () => {
    if (!hasMorePrev || isLoadingMore || feeds.length === 0) return;

    try {
      setIsLoadingMore(true);
      const firstFeedId = feeds[0].feedId;
      const navigation = await getFeedNavigation(firstFeedId);

      if (navigation.prevFeeds.length > 0) {
        const newFeeds = navigation.prevFeeds
          .reverse()
          .map(transformFeedItem)
          .filter((newFeed) => !feeds.some((f) => f.feedId === newFeed.feedId)); // 중복 제거

        if (newFeeds.length > 0) {
          // 현재 스크롤 위치 저장
          const newIndex = currentIndexRef.current + newFeeds.length;

          setFeeds((prev) => [...newFeeds, ...prev]);

          // 인덱스 조정 및 스크롤 위치 유지
          currentIndexRef.current = newIndex;

          // 스크롤 위치 복원
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: newIndex,
              animated: false,
            });
          }, 50);
        }
        setHasMorePrev(navigation.hasMorePrev);
      } else {
        setHasMorePrev(false);
      }
    } catch (error) {
      console.error('이전 피드 로드 실패:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMorePrev, isLoadingMore, feeds]);

  // 다음 피드들 추가 로드 (아래로 스크롤)
  const loadMoreNext = useCallback(async () => {
    if (!hasMoreNext || isLoadingMore || feeds.length === 0) return;

    try {
      setIsLoadingMore(true);
      const lastFeedId = feeds[feeds.length - 1].feedId;
      const navigation = await getFeedNavigation(lastFeedId);

      if (navigation.nextFeeds.length > 0) {
        const newFeeds = navigation.nextFeeds
          .map(transformFeedItem)
          .filter((newFeed) => !feeds.some((f) => f.feedId === newFeed.feedId)); // 중복 제거

        if (newFeeds.length > 0) {
          setFeeds((prev) => [...prev, ...newFeeds]);
        }
        setHasMoreNext(navigation.hasMoreNext);
      } else {
        setHasMoreNext(false);
      }
    } catch (error) {
      console.error('다음 피드 로드 실패:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMoreNext, isLoadingMore, feeds]);

  // 현재 보이는 피드 추적 및 URL 업데이트
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const visibleItem = viewableItems[0];
        if (visibleItem && visibleItem.item) {
          const feedId = (
            visibleItem.item as ReturnType<typeof transformFeedItem>
          ).feedId;
          currentIndexRef.current = visibleItem.index ?? 0;

          // URL 업데이트 (히스토리에 추가하지 않음)
          router.setParams({ id: feedId.toString() });
        }
      }
    },
  ).current;

  // 스크롤 끝에 도달했을 때 추가 로드
  const handleEndReached = () => {
    loadMoreNext();
  };

  const handleEndReachedFromTop = () => {
    loadMorePrev();
  };

  // 초기 스크롤 위치 설정 (초기 로딩 후 한 번만 실행)
  useEffect(() => {
    if (!isLoading && feeds.length > 0 && currentIndexRef.current > 0) {
      // 약간의 딜레이 후 스크롤 이동
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: currentIndexRef.current,
          animated: false,
        });
      }, 100);
    }
  }, [isLoading]);

  if (isLoading) return <Loading />;

  return (
    <FlatList
      ref={flatListRef}
      data={feeds}
      keyExtractor={(item, index) => `feed-${item.feedId}-${index}`}
      pagingEnabled
      snapToInterval={SCREEN_HEIGHT}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      extraData={feeds}
      getItemLayout={(_, index) => ({
        length: SCREEN_HEIGHT,
        offset: SCREEN_HEIGHT * index,
        index,
      })}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
      }}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      // React Native FlatList는 onStartReached가 없으므로 스크롤 이벤트로 처리
      onScroll={(event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY <= SCREEN_HEIGHT && hasMorePrev && !isLoadingMore) {
          handleEndReachedFromTop();
        }
      }}
      scrollEventThrottle={400}
      renderItem={({ item }) => (
        <View style={{ height: SCREEN_HEIGHT }}>
          <FeedDetailItem feed={item} />
        </View>
      )}
    />
  );
}
