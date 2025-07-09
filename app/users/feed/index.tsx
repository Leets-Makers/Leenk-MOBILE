import { Container } from '@/app/(post)/feed';
import { FeedCard, Header, Loading } from '@/components';
import TabMenu from '@/components/feed/TabMenu';
import { FlatList, View } from 'react-native';
import { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { height } from '@/theme/globalStyles';
import useFeedList from '@/hooks/useFeedList';
import { useLocalSearchParams } from 'expo-router';

export default function OtherUserProfilePage() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [tab, setTab] = useState<'uploaded' | 'joined'>('uploaded');
  console.log('받은 userId:', userId);
  const {
    data: feeds,
    loadMore,
    isLoading,
    isRefreshing,
    refresh,
  } = useFeedList({
    type: tab === 'uploaded' ? 'userFeed' : 'userJoined',
    userId: Number(userId),
    pageSize: 10,
  });

  useEffect(() => {
    refresh();
  }, [tab]);

  if (feeds.length === 0 && isLoading) return <Loading />;

  if (!feeds) return null;

  return (
    <Container>
      <Header />
      <TabMenu
        activeTab={tab}
        onTabChange={(newTab: string) => {
          if (newTab === 'uploaded' || newTab === 'joined') {
            setTab(newTab);
          }
        }}
      />

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
