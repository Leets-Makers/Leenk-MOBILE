import { useEffect, useState } from 'react';
import { Header, FeedCard, CustomButton, Loading } from '@/components';
import colors from '@/theme/color';
import { View, FlatList } from 'react-native';
import { width, height } from '@/theme/globalStyles';
import BottomSheetModal from '@/components/Modal/BottomSheetModal';
import { SubText, TitleText } from '@/components/OnBoarding';
import useFirstLaunch from '@/hooks/useFirstLaunch';
import { CongratsIcon } from '@/assets';
import useFeedList from '@/hooks/useFeedList';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useUserStore } from '@/stores/userStore';

export default function FeedPage() {
  const firstLaunch = useFirstLaunch();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const { userInfo: fetchedUserInfo, refetch, loading } = useUserInfo();
  const { userInfo, setUserInfo } = useUserStore();

  useEffect(() => {
    if (!userInfo) {
      refetch().then(() => {
        if (fetchedUserInfo) {
          setUserInfo(fetchedUserInfo);
        }
      });
    }
  }, [userInfo, fetchedUserInfo, refetch, setUserInfo]);

  useEffect(() => {
    if (firstLaunch === true) {
      // 처음 방문이면 모달 표시
      setShowWelcomeModal(true);
    }
  }, [firstLaunch]);

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
        paddingHorizontal: 20 * width,
      }}
    >
      <Header LeftSection="LOGO" RightSection="BELL" />
      <FlatList
        data={feeds}
        numColumns={2}
        keyExtractor={(item) => item.feedId.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{
          paddingBottom: 100 * height,
          paddingTop: 12 * height,
        }}
        renderItem={({ item }) => <FeedCard item={item} />}
        showsVerticalScrollIndicator={true}
        onEndReached={loadMore} // 스크롤 끝 도달 시 loadMore 실행
        onEndReachedThreshold={0.5} // 50% 스크롤 시점부터 호출
        refreshing={isRefreshing} // Pull to Refresh
        onRefresh={refresh}
        ListFooterComponent={feeds.length > 0 && isLoading ? <Loading /> : null}
      />

      {showWelcomeModal && (
        <BottomSheetModal visible={true}>
          <TitleText>Leenk에 온 걸 환영해!</TitleText>
          <SubText>{'앞으로 신나는 링크 활동 부탁할게 :)'}</SubText>
          <CongratsIcon
            height={200}
            width={200}
            style={{
              alignSelf: 'center',
              marginTop: 16 * height,
              marginBottom: 40 * height,
            }}
          />
          <CustomButton
            fullWidth
            onPress={() => {
              setShowWelcomeModal(false);
            }}
          >
            나도 잘 부탁해
          </CustomButton>
        </BottomSheetModal>
      )}
    </View>
  );
}
