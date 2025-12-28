// 상세 피드에서 수직 스크롤을 위해 분리한 컴포넌트

import { FlatList, View } from 'react-native';
import FeedDetailItem from './FeedDetailItem';
import { Loading } from '@/components';
import { useFeedDetailNavigation } from '@/hooks/useFeedDetailNavigation';
import { SCREEN_HEIGHT } from '@/theme/globalStyles';
import { useDelayedLoading } from '@/hooks/useDelayedLoading';
interface FeedDetailListProps {
  initialFeedId: number;
}

export default function FeedDetailList({ initialFeedId }: FeedDetailListProps) {
  const {
    feeds,
    isLoading,
    flatListRef,
    onViewableItemsChanged,
    loadMoreNext,
    loadMorePrev,
    hasMorePrev,
    isLoadingMore,
  } = useFeedDetailNavigation(initialFeedId);

  const showInitialLoading = useDelayedLoading(
    isLoading && feeds.length === 0,
    { delay: 250 },
  );

  if (showInitialLoading) return <Loading />;

  return (
    <FlatList
      ref={flatListRef}
      data={feeds}
      keyExtractor={(item) => item._uniqueKey}
      pagingEnabled
      snapToInterval={SCREEN_HEIGHT}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      getItemLayout={(_, index) => ({
        length: SCREEN_HEIGHT,
        offset: SCREEN_HEIGHT * index,
        index,
      })}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      onEndReached={loadMoreNext}
      onEndReachedThreshold={0.5}
      onScroll={(e) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        if (offsetY <= SCREEN_HEIGHT && hasMorePrev && !isLoadingMore) {
          loadMorePrev();
        }
      }}
      renderItem={({ item }) => (
        <View style={{ height: SCREEN_HEIGHT }}>
          <FeedDetailItem feed={item} />
        </View>
      )}
    />
  );
}
