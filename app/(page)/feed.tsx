import { useEffect, useState } from 'react';
import { Header, FeedCard, CustomButton } from '@/components';
import colors from '@/theme/color';
import { View, FlatList } from 'react-native';
import { generateMockFeeds } from '@/__mocks__/mockFeed';
import { FeedItem } from '@/types/feed';
import { width, height } from '@/theme/globalStyles';
import BottomSheetModal from '@/components/Modal/BottomSheetModal';
import OnBoarding, { SubText, TitleText } from '@/components/OnBoarding';
import useFirstLaunch from '@/hooks/useFirstLaunch';
import { CongratsIcon } from '@/assets';

const mockFeeds: FeedItem[] = generateMockFeeds(20);

export default function FeedPage() {
  // const [modalVisible, setModalVisible] = useState(false);

  // useEffect(() => {
  //   // 페이지 진입 시 모달 자동 표시
  //   setModalVisible(true);
  // }, []);

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // 처음 접속한 사람만 모달 뜨게 하는 훅인데 일단 확인하려고 주석 처리 했어요!
  const firstLaunch = useFirstLaunch();
  useEffect(() => {
    // 페이지 진입 시 모달 자동 표시
    setShowWelcomeModal(true);
  }, []);
  const goToFeed = () => {
    // if (firstLaunch === null) return;
    // if (firstLaunch === true) {
    //   setShowWelcomeModal(true);
    // } else {
    //   router.push('/(page)/feed');
    // }
  };

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
        data={mockFeeds}
        numColumns={2}
        keyExtractor={(item) => item.feedId.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{
          paddingBottom: 100 * height,
          paddingTop: 12 * height,
        }}
        renderItem={({ item }) => <FeedCard item={item} />}
        showsVerticalScrollIndicator={true}
      />

      {/* <BottomSheetModal visible={modalVisible}>
        <OnBoarding onClose={() => setModalVisible(false)} />
      </BottomSheetModal> */}
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
