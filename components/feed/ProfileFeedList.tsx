import { FlatList } from 'react-native';
import { FeedCard, Loading } from '@/components';
import useFeedList from '@/hooks/useFeedList';
import styled from 'styled-components/native';
import { height } from '@/theme/globalStyles';
import { useEffect } from 'react';

interface FeedListProps {
  type: 'myFeed' | 'myJoined';
  onTotalReactionCountChange: (count: number) => void;
}

export default function ProfileFeedList({
  type,
  onTotalReactionCountChange,
}: FeedListProps) {
  const {
    data: feeds,
    loadMore,
    isLoading,
    isRefreshing,
    refresh,
    totalReactionCount,
  } = useFeedList({
    type,
    pageSize: 10,
  });

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    onTotalReactionCountChange(totalReactionCount ?? 0);
  }, [totalReactionCount, onTotalReactionCountChange]);

  if (feeds.length === 0 && isLoading) return <Loading />;
  if (!feeds) return null;

  return (
    <Content>
      <FlatList
        data={feeds}
        numColumns={2}
        keyExtractor={(item) => item.feedId.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{
          paddingBottom: 100 * height,
        }}
        renderItem={({ item }) => <FeedCard item={item} />}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListFooterComponent={feeds.length > 0 && isLoading ? <Loading /> : null}
      />
    </Content>
  );
}

const Content = styled.View`
  flex: 1;
  margin-top: ${8 * height}px;
`;
