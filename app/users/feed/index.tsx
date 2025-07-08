import { Container } from '@/app/(post)/feed';
import { FeedCard, Header, Loading } from '@/components';
import TabMenu from '@/components/feed/TabMenu';
import { FlatList, View } from 'react-native';
import { useState } from 'react';
import styled from 'styled-components/native';
import { height } from '@/theme/globalStyles';
import useFeedList from '@/hooks/useFeedList';

export default function OtherUserProfilePage() {
  const [tab, setTab] = useState<'uploaded' | 'joined'>('uploaded');

  const {
    data: feeds,
    loadMore,
    isLoading,
    isRefreshing,
    refresh,
  } = useFeedList(10);

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
        {tab === 'uploaded' ? (
          // 올린 피드 컴포넌트
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
        ) : (
          // 함께한 피드 컴포넌트
          <View />
        )}
      </Content>
    </Container>
  );
}

const Content = styled.View`
  flex: 1;
  margin-top: ${8 * height}px;
`;
