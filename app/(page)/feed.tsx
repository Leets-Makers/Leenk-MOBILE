import { Header, FeedCard } from '@/components';
import colors from '@/theme/color';
import { View, FlatList } from 'react-native';
import { LogoText, BellIcon } from '@/assets';
import { generateMockFeeds } from '@/__mocks__/mockFeed';
import { FeedItem } from '@/types/feed';
import { width, height } from '@/theme/globalStyles';

const mockFeeds: FeedItem[] = generateMockFeeds(20);

export default function FeedPage() {
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
    </View>
  );
}
