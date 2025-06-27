import { Header, FeedCard } from '@/components';
import colors from '@/theme/color';
import { View, FlatList } from 'react-native';
import { LogoText, BellIcon } from '@/assets';
import { generateMockFeeds } from '@/__mocks__/mockFeed';
import { FeedItem } from '@/types/feed';
import { width, height } from '@/theme/globalStyles';
import { useEffect, useRef } from 'react';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import CommonBottomSheet from '@/components/Modal/BottomSheetModal';

const mockFeeds: FeedItem[] = generateMockFeeds(20);

export default function FeedPage() {
  const bottomSheetRef = useRef<BottomSheetModalMethods>(null);

  useEffect(() => {
    bottomSheetRef.current?.present();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg[2],
        paddingHorizontal: 16 * width,
      }}
    >
      <Header
        LeftSection={<LogoText width={65} height={24} />}
        RightSection={<BellIcon />}
      />
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
      <CommonBottomSheet
        isOnboarding
        ref={bottomSheetRef}
        title="피드에 오신 것을 환영합니다!"
        subText="이 앱은 당신의 일상을 기록할 수 있어요."
      />
    </View>
  );
}
