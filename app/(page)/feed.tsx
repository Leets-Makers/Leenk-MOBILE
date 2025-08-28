import { useEffect } from 'react';
import { Header, FeedCard, Loading } from '@/components';
import colors from '@/theme/color';
import { View, FlatList } from 'react-native';
import { width, height } from '@/theme/globalStyles';

import useFeedList from '@/hooks/useFeedList';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useUserStore } from '@/stores/userStore';
import { useBlockBackHandler } from '@/hooks/useBlockBackHandler';
import { FEED_PADDING } from '@/constants';

export default function FeedPage() {
  const { userInfo: fetchedUserInfo, refetch } = useUserInfo();
  const { userInfo, setUserInfo } = useUserStore();

  useBlockBackHandler({
    block: true,
    exitOnDoubleBack: true,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (fetchedUserInfo && !userInfo) {
      setUserInfo(fetchedUserInfo);
    }
  }, [fetchedUserInfo, userInfo, setUserInfo]);

  const {
    data: feeds,
    loadMore,
    isLoading,
    isRefreshing,
    refresh,
  } = useFeedList({ type: 'all', pageSize: 10 });

  if (feeds.length === 0 && isLoading) return <Loading />;

  if (!feeds) return null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg[2],
      }}
    >
      <Header
        LeftSection="LOGO"
        RightSection="BELL"
        style={{ paddingHorizontal: FEED_PADDING * width }}
      />
      <FlatList
        data={feeds}
        numColumns={2}
        keyExtractor={(item) => item.feedId.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{
          paddingBottom: 100 * height,
          paddingTop: 12 * height,
          paddingHorizontal: FEED_PADDING * width,
        }}
        renderItem={({ item }) => <FeedCard item={item} />}
        showsVerticalScrollIndicator
        onEndReached={loadMore} // 스크롤 끝 도달 시 loadMore 실행
        onEndReachedThreshold={0.5} // 50% 스크롤 시점부터 호출
        refreshing={isRefreshing} // Pull to Refresh
        onRefresh={refresh}
        ListFooterComponent={feeds.length > 0 && isLoading ? <Loading /> : null}
      />
    </View>
  );
}
