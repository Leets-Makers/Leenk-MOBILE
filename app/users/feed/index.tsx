import { FeedCard, Header, Loading } from '@/components';
import TabMenu from '@/components/common/TabMenu';
import { FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { height, width } from '@/theme/globalStyles';
import useFeedList from '@/hooks/useFeedList';
import { useLocalSearchParams } from 'expo-router';
import { ContainerWithNoPadding } from '@/app/account/my-feed';
import { FEED_PADDING } from '@/constants';
import { View } from 'react-native';

export default function OtherUserProfilePage() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [tab, setTab] = useState<'uploaded' | 'joined'>('uploaded');
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
    <ContainerWithNoPadding>
      <View style={{ paddingHorizontal: FEED_PADDING * width }}>
        <Header />
        <TabMenu
          activeTab={tab}
          onTabChange={(newTab: string) => {
            if (newTab === 'uploaded' || newTab === 'joined') {
              setTab(newTab);
            }
          }}
        />
      </View>
      <Content>
        <FlatList
          data={feeds}
          numColumns={2}
          keyExtractor={(item) => item.feedId.toString()}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{
            paddingBottom: 100 * height,
            paddingHorizontal: FEED_PADDING * width,
          }}
          renderItem={({ item }) => <FeedCard item={item} />}
          showsVerticalScrollIndicator
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          onRefresh={refresh}
          ListFooterComponent={
            feeds.length > 0 && isLoading ? <Loading /> : null
          }
        />
      </Content>
    </ContainerWithNoPadding>
  );
}

export const Content = styled.View`
  flex: 1;
  margin-top: ${8 * height}px;
`;
