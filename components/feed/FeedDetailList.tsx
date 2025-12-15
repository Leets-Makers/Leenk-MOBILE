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

const transformFeedItem = (item: FeedNavigationItem, uniqueKey?: string) => {
  return {
    feedId: item.feedId,
    author: item.author,
    description: item.description,
    totalReactionCount: item.totalReactionCount,
    createdAt: item.createdAt,
    media: item.media ?? [],
    linkedUserCount: item.linkedUserCount ?? 0,
    linkedUser: item.linkedUser ?? [],
    _uniqueKey: uniqueKey ?? `${item.feedId}-${Date.now()}`,
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
  const initialLoadDoneRef = useRef(false); // 초기 로딩 완료 플래그
  const initialFeedIdRef = useRef(initialFeedId); // 최초 feedId 저장

  // 초기 피드 네비게이션 불러오기
  const fetchInitialFeeds = async () => {
    try {
      setIsLoading(true);
      // 초기 로딩: 이전 2개, 다음 2개
      const navigation = await getFeedNavigation(
        initialFeedIdRef.current,
        2,
        2,
      );

      // 디버깅: API 응답 구조 확인
      if (__DEV__) {
        console.log('=== 피드 네비게이션 API 응답 ===');
        console.log(
          'current linkedUser:',
          JSON.stringify(navigation.current.linkedUser, null, 2),
        );
      }

      // prevFeeds(역순) + current + nextFeeds 순서로 배열 구성
      // 각 피드에 고유 key를 부여하여 FlatList 재활용 문제 방지
      const timestamp = Date.now();
      const transformedCurrent = transformFeedItem(
        navigation.current,
        `current-${navigation.current.feedId}-${timestamp}`,
      );
      const allFeeds = [
        ...navigation.prevFeeds
          .reverse()
          .map((item, idx) =>
            transformFeedItem(item, `prev-${item.feedId}-${idx}-${timestamp}`),
          ),
        transformedCurrent,
        ...navigation.nextFeeds.map((item, idx) =>
          transformFeedItem(item, `next-${item.feedId}-${idx}-${timestamp}`),
        ),
      ];

      // 디버깅: 변환된 current 데이터 확인
      if (__DEV__) {
        console.log('=== 변환된 current 피드 ===');
        console.log('feedId:', transformedCurrent.feedId);
        console.log('linkedUserCount:', transformedCurrent.linkedUserCount);
        console.log(
          'linkedUser 길이:',
          transformedCurrent.linkedUser?.length ?? 0,
        );
        if (transformedCurrent.linkedUser?.length > 0) {
          console.log(
            'linkedUser[0]:',
            JSON.stringify(transformedCurrent.linkedUser[0], null, 2),
          );
          console.log(
            'linkedUser[마지막]:',
            JSON.stringify(
              transformedCurrent.linkedUser[
                transformedCurrent.linkedUser.length - 1
              ],
              null,
              2,
            ),
          );
        }
      }

      setFeeds(allFeeds);
      setHasMorePrev(navigation.hasMorePrev);
      setHasMoreNext(navigation.hasMoreNext);

      // 초기 인덱스는 current의 위치 (prevFeeds 개수만큼 오프셋)
      currentIndexRef.current = navigation.prevFeeds.length;
      initialLoadDoneRef.current = true; // 초기 로딩 완료 표시
    } catch (error) {
      console.error('피드 네비게이션 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // initialFeedId가 변경되었을 때 데이터 새로 로드
    if (
      !initialLoadDoneRef.current ||
      initialFeedIdRef.current !== initialFeedId
    ) {
      // 기존 상태 초기화
      setFeeds([]);
      setIsLoading(true);
      initialLoadDoneRef.current = false;
      initialFeedIdRef.current = initialFeedId;

      fetchInitialFeeds();
    }
  }, [initialFeedId]);

  // 이전 피드들 추가 로드 (위로 스크롤)
  const loadMorePrev = useCallback(async () => {
    if (!hasMorePrev || isLoadingMore || feeds.length === 0) return;

    try {
      setIsLoadingMore(true);
      const firstFeedId = feeds[0].feedId;
      // 이전 피드만 3개 가져오기
      const navigation = await getFeedNavigation(firstFeedId, 2, 0);

      if (navigation.prevFeeds.length > 0) {
        const timestamp = Date.now();
        const newFeeds = navigation.prevFeeds
          .reverse()
          .map((item, idx) =>
            transformFeedItem(item, `prev-${item.feedId}-${idx}-${timestamp}`),
          )
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
      // 다음 피드만 3개 가져오기
      const navigation = await getFeedNavigation(lastFeedId, 0, 2);

      if (navigation.nextFeeds.length > 0) {
        const timestamp = Date.now();
        const newFeeds = navigation.nextFeeds
          .map((item, idx) =>
            transformFeedItem(item, `next-${item.feedId}-${idx}-${timestamp}`),
          )
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

  // 현재 보이는 피드 ID 추적을 위한 ref
  const currentVisibleFeedIdRef = useRef<number>(initialFeedId);

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

          // 이미 같은 feedId면 URL 업데이트 생략
          if (currentVisibleFeedIdRef.current !== feedId) {
            currentVisibleFeedIdRef.current = feedId;
            // URL 업데이트 (히스토리에 추가하지 않음)
            router.setParams({ id: feedId.toString() });
          }
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

  if (isLoading && feeds.length === 0) {
    return <Loading />;
  }

  return (
    <FlatList
      ref={flatListRef}
      data={feeds}
      initialScrollIndex={currentIndexRef.current}
      keyExtractor={(item) => item._uniqueKey ?? `feed-${item.feedId}`}
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
      onScroll={(event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY <= SCREEN_HEIGHT && hasMorePrev && !isLoadingMore) {
          handleEndReachedFromTop();
        }
      }}
      scrollEventThrottle={400}
      renderItem={({ item }) => (
        <View key={item.feedId} style={{ height: SCREEN_HEIGHT }}>
          <FeedDetailItem feed={item} />
        </View>
      )}
    />
  );
}
