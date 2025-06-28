import { useEffect, useState } from 'react';
import { Header, FeedCard } from '@/components';
import colors from '@/theme/color';
import { View, FlatList, Text } from 'react-native';
import { generateMockFeeds } from '@/__mocks__/mockFeed';
import { FeedItem } from '@/types/feed';
import { width, height } from '@/theme/globalStyles';
import BottomSheetModal from '@/components/Modal/BottomSheetModal';
import OnBoarding from '@/components/OnBoarding';

const mockFeeds: FeedItem[] = generateMockFeeds(20);

export default function FeedPage() {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // 페이지 진입 시 모달 자동 표시
    setModalVisible(true);
  }, []);

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

      <BottomSheetModal visible={modalVisible}>
        <OnBoarding onClose={() => setModalVisible(false)} />
      </BottomSheetModal>
    </View>
  );
}
