import { Container } from '@/app/(post)/feed';
import { FeedCard, Header, Loading } from '@/components';
import TabMenu from '@/components/feed/TabMenu';
import { FlatList, View } from 'react-native';
import { useState } from 'react';
import styled from 'styled-components/native';
import { height } from '@/theme/globalStyles';
import useFeedList, { UseFeedListOptions } from '@/hooks/useFeedList';
import MyTotalReactionCount from '@/components/feed/MyTotalReactionCount';

export default function MyFeedPage() {
  const [tab, setTab] = useState<'uploaded' | 'joined'>('uploaded');

  const feedListProps: UseFeedListOptions =
    tab === 'uploaded'
      ? { type: 'myFeed', pageSize: 10 }
      : { type: 'myJoined', pageSize: 10 };

  const {
    data: feeds,
    loadMore,
    isLoading,
    isRefreshing,
    refresh,
    totalReactionCount,
  } = useFeedList(feedListProps);

  if (feeds.length === 0 && isLoading) return <Loading />;
  if (!feeds) return null;

  return (
    <Container>
      <Header RightSection="SETTING" />
      <TabMenu
        activeTab={tab}
        onTabChange={(newTab: string) => {
          if (newTab === 'uploaded' || newTab === 'joined') {
            setTab(newTab);
            refresh(); // 탭 변경 시 새로고침
          }
        }}
      />
      {tab === 'uploaded' && (
        <MyTotalReactionCount totalReactionCount={totalReactionCount ?? 0} />
      )}
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
          showsVerticalScrollIndicator={true}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          onRefresh={refresh}
          ListFooterComponent={
            feeds.length > 0 && isLoading ? <Loading /> : null
          }
        />
      </Content>
    </Container>
  );
}

const Content = styled.View`
  flex: 1;
  margin-top: ${8 * height}px;
`;
