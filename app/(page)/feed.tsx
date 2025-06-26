import { Header, FeedCard } from '@/components';
import colors from '@/theme/color';
import { View, FlatList } from 'react-native';
import { LogoText, BellIcon } from '@/assets';
import { generateMockFeeds } from '@/__mocks__/mockFeed';
import { FeedItem } from '@/types/feed';

const mockFeeds: FeedItem[] = generateMockFeeds(20);

export default function FeedPage() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg[2] }}>
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
          paddingHorizontal: 16,
          paddingBottom: 100,
          paddingTop: 12,
        }}
        renderItem={({ item }) => <FeedCard item={item} />}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}
