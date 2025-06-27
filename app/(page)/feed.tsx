import { useEffect, useState } from 'react';
import { Header, FeedCard } from '@/components';
import colors from '@/theme/color';
import { View, FlatList } from 'react-native';
import { LogoText, BellIcon } from '@/assets';
import { generateMockFeeds } from '@/__mocks__/mockFeed';
import { FeedItem } from '@/types/feed';
import { width, height } from '@/theme/globalStyles';
import BottomModal from '@/components/Modal/BottomModal';

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

      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View>
          <HeaderText>피드에 오신 걸 환영해요!</HeaderText>
        </View>
      </BottomModal>
    </View>
  );
}

import styled from 'styled-components/native';

const HeaderText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;
