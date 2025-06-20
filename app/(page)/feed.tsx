import { Header } from '@/components';
import colors from '@/theme/color';
import { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { LogoText, BellIcon } from '@/assets';
import FeedCard from '@/components/feed/FeedCard';
import { generateMockFeeds } from '@/__mocks__/mockFeed';
import { FeedItem } from '@/types/feed';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockFeeds: FeedItem[] = generateMockFeeds(30);

export default function FeedPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg[2] }}>
      <View style={{ flex: 1 }}>
        <Header
          LeftSection={<LogoText width={65} height={24} />}
          RightSection={<BellIcon />}
        />
        <FeedList
          data={mockFeeds}
          numColumns={2}
          keyExtractor={(item) => item.feedId.toString()}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          renderItem={({ item }) => <FeedCard item={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const FeedList = styled.FlatList`
  flex: 1;
`;
