import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, ViewToken } from 'react-native';
import { router } from 'expo-router';
import { getFeedNavigation } from '@/api/feed/feed.api';
import { FeedNavigationItem } from '@/types/feed';

const transformFeedItem = (item: FeedNavigationItem, uniqueKey?: string) => ({
  feedId: item.feedId,
  author: item.author,
  description: item.description,
  totalReactionCount: item.totalReactionCount,
  createdAt: item.createdAt,
  media: item.media ?? [],
  linkedUserCount: item.linkedUserCount ?? 0,
  linkedUser: item.linkedUser ?? [],
  _uniqueKey: uniqueKey ?? `${item.feedId}-${Date.now()}`,
});

export function useFeedDetailNavigation(initialFeedId: number) {
  const [feeds, setFeeds] = useState<ReturnType<typeof transformFeedItem>[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasMorePrev, setHasMorePrev] = useState(false);
  const [hasMoreNext, setHasMoreNext] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const currentIndexRef = useRef(0);
  const initialFeedIdRef = useRef(initialFeedId);
  const initialLoadDoneRef = useRef(false);
  const currentVisibleFeedIdRef = useRef<number>(initialFeedId);

  const needsInitialScrollRef = useRef(true);

  // 초기 로딩
  const fetchInitialFeeds = async () => {
    try {
      setIsLoading(true);

      const navigation = await getFeedNavigation(
        initialFeedIdRef.current,
        2,
        2,
      );

      const timestamp = Date.now();

      const allFeeds = [
        ...navigation.prevFeeds.map((item, idx) =>
          transformFeedItem(item, `prev-${item.feedId}-${idx}-${timestamp}`),
        ),
        transformFeedItem(
          navigation.current,
          `current-${navigation.current.feedId}-${timestamp}`,
        ),
        ...navigation.nextFeeds.map((item, idx) =>
          transformFeedItem(item, `next-${item.feedId}-${idx}-${timestamp}`),
        ),
      ];

      setFeeds(allFeeds);
      setHasMorePrev(navigation.hasMorePrev);
      setHasMoreNext(navigation.hasMoreNext);

      currentIndexRef.current = navigation.prevFeeds.length;
      initialLoadDoneRef.current = true;
    } catch (e) {
      console.error('피드 네비게이션 초기 로드 실패', e);
    } finally {
      setIsLoading(false);
    }
  };

  // initialFeedId 변경 처리
  useEffect(() => {
    if (!initialLoadDoneRef.current) {
      initialFeedIdRef.current = initialFeedId;
      fetchInitialFeeds();
      return;
    }

    if (initialFeedIdRef.current !== initialFeedId) {
      const exists = feeds.some((f) => f.feedId === initialFeedId);
      if (!exists) {
        setFeeds([]);
        initialLoadDoneRef.current = false;
        initialFeedIdRef.current = initialFeedId;
        fetchInitialFeeds();
      }
    }
  }, [initialFeedId]);

  // 이전 피드 로드
  const loadMorePrev = useCallback(async () => {
    if (!hasMorePrev || isLoadingMore || feeds.length === 0) return;

    try {
      setIsLoadingMore(true);
      const firstFeedId = feeds[0].feedId;
      const navigation = await getFeedNavigation(firstFeedId, 2, 0);

      if (navigation.prevFeeds.length === 0) {
        setHasMorePrev(false);
        return;
      }

      const timestamp = Date.now();
      const newFeeds = navigation.prevFeeds
        .reverse()
        .map((item, idx) =>
          transformFeedItem(item, `prev-${item.feedId}-${idx}-${timestamp}`),
        )
        .filter((nf) => !feeds.some((f) => f.feedId === nf.feedId));

      if (newFeeds.length > 0) {
        const newIndex = currentIndexRef.current + newFeeds.length;
        setFeeds((prev) => [...newFeeds, ...prev]);
        currentIndexRef.current = newIndex;

        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: newIndex,
            animated: false,
          });
        }, 50);
      }

      setHasMorePrev(navigation.hasMorePrev);
    } catch (e) {
      console.error('이전 피드 로드 실패', e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMorePrev, isLoadingMore, feeds]);

  // 다음 피드 로드

  const loadMoreNext = useCallback(async () => {
    if (!hasMoreNext || isLoadingMore || feeds.length === 0) return;

    try {
      setIsLoadingMore(true);
      const lastFeedId = feeds[feeds.length - 1].feedId;
      const navigation = await getFeedNavigation(lastFeedId, 0, 2);

      if (navigation.nextFeeds.length === 0) {
        setHasMoreNext(false);
        return;
      }

      const timestamp = Date.now();
      const newFeeds = navigation.nextFeeds
        .map((item, idx) =>
          transformFeedItem(item, `next-${item.feedId}-${idx}-${timestamp}`),
        )
        .filter((nf) => !feeds.some((f) => f.feedId === nf.feedId));

      if (newFeeds.length > 0) {
        setFeeds((prev) => [...prev, ...newFeeds]);
      }

      setHasMoreNext(navigation.hasMoreNext);
    } catch (e) {
      console.error('다음 피드 로드 실패', e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMoreNext, isLoadingMore, feeds]);

  useEffect(() => {
    if (!feeds.length || !needsInitialScrollRef.current) return;

    const targetFeedId = initialFeedIdRef.current;

    const index = feeds.findIndex((f) => f.feedId === targetFeedId);
    if (index === -1) return;

    needsInitialScrollRef.current = false;
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToIndex({
        index,
        animated: false,
      });
    });
  }, [feeds]);

  // 현재 보이는 아이템 추적
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!viewableItems.length) return;

      const item = viewableItems[0].item as ReturnType<
        typeof transformFeedItem
      >;

      currentIndexRef.current = viewableItems[0].index ?? 0;

      if (currentVisibleFeedIdRef.current !== item.feedId) {
        currentVisibleFeedIdRef.current = item.feedId;
        initialFeedIdRef.current = item.feedId;
        router.setParams({ id: item.feedId.toString() });
      }
    },
  ).current;

  return {
    feeds,
    isLoading,
    flatListRef,
    onViewableItemsChanged,
    loadMorePrev,
    loadMoreNext,
    hasMorePrev,
    hasMoreNext,
    isLoadingMore,
  };
}
