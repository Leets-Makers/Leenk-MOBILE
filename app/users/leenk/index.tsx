import React, { useRef } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useLocalSearchParams } from 'expo-router';

import { Header, Loading } from '@/components';
import { height, width } from '@/theme/globalStyles';
import { FEED_PADDING } from '@/constants';

import useLeenkList from '@/hooks/useLeenkList';
import { LeenkList, Separator } from '@/app/(page)/leenk';
import { LeenkListItem } from '@/components';
import colors from '@/theme/color';
import { useDelayedLoading } from '@/hooks/useDelayedLoading';

export default function OtherUserLeenkPage() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const uid = Number(userId);

  const {
    data: leenks,
    loadMore,
    isLoading,
    isRefreshing,
    refresh,
  } = useLeenkList({
    type: 'userLeenk', // 다른 유저가 '참여한' 모임
    userId: uid,
    pageSize: 10,
  });

  const listRef = useRef<any>(null);
  const onEndReachedCalledDuringMomentum = useRef(false);

  const showInitialLoading = useDelayedLoading(
    isLoading && leenks.length === 0,
    { delay: 250 },
  );

  if (showInitialLoading) return <Loading />;

  return (
    <Container>
      <View style={{ paddingHorizontal: FEED_PADDING * width }}>
        <Header>참여한 모임</Header>
      </View>

      <Content>
        <LeenkList
          ref={listRef}
          data={leenks}
          keyExtractor={(item) => String(item.leenkId)}
          renderItem={({ item }) => <LeenkListItem item={item} />}
          ItemSeparatorComponent={() => <Separator />}
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum.current) {
              loadMore();
              onEndReachedCalledDuringMomentum.current = true;
            }
          }}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          refreshing={isRefreshing}
          onRefresh={refresh}
          showsVerticalScrollIndicator
          ListFooterComponent={
            <View
              style={{ height: 60 * height, opacity: isLoading ? 0.6 : 0 }}
            />
          }
          contentContainerStyle={{
            paddingHorizontal: FEED_PADDING * width,
            paddingBottom: 100 * height,
          }}
        />
      </Content>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.gray[50]};
`;

const Content = styled.View`
  flex: 1;
  margin-top: ${16 * height}px;
`;
