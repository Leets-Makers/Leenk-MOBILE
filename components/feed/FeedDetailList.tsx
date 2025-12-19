// 상세 피드에서 수직 스크롤을 위해 분리한 컴포넌트

import { FlatList, View } from 'react-native';
import FeedDetailItem from './FeedDetailItem';
import { Loading } from '@/components';
import { useFeedDetailNavigation } from '@/hooks/useFeedDetailNavigation';
import { SCREEN_HEIGHT } from '@/theme/globalStyles';
interface FeedDetailListProps {
  initialFeedId: number;
}

export default function FeedDetailList({ initialFeedId }: FeedDetailListProps) {
  const {
    feeds,
    isLoading,
    flatListRef,
    initialIndex,
    onViewableItemsChanged,
    loadMoreNext,
    loadMorePrev,
    hasMorePrev,
    isLoadingMore,
  } = useFeedDetailNavigation(initialFeedId);

  if (isLoading && feeds.length === 0) return <Loading />;

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
      onScrollToIndexFailed={(info) => {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: info.index,
            animated: false,
          });
        }, 50);
      }}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      onEndReached={loadMoreNext}
      onEndReachedThreshold={0.5}
      onScroll={(event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY <= SCREEN_HEIGHT && hasMorePrev && !isLoadingMore) {
          loadMorePrev();
        }
      }}
      scrollEventThrottle={16}
      renderItem={({ item }) => (
        <View style={{ height: SCREEN_HEIGHT }}>
          <FeedDetailItem feed={item} />
        </View>
      )}
    />
  );
}
