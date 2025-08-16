import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { width, height } from '@/theme/globalStyles';
import { Header } from '@/components';
import TabMenu from '@/components/common/TabMenu';
import LeenkListItem from '@/components/leenk/LeenkListItem';
import { ContainerWithNoPadding } from '../account/my-feed';
import { View } from 'react-native';
import { FEED_PADDING } from '@/constants';

import { getLeenkList } from '@/api/leenk/leenk.get.api';
import { Leenk } from '@/types/leenk';

const PAGE_SIZE = 10;
const tabToStatus = (tab: 'all' | 'open' | 'close') =>
  tab === 'all' ? 'ALL' : tab === 'open' ? 'OPEN' : 'CLOSED';

export default function LeenkPage() {
  const [tab, setTab] = useState<'all' | 'open' | 'close'>('all');

  // list / paging states
  const [data, setData] = useState<Leenk[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // prevent duplicated calls on momentum
  const onEndReachedCalledDuringMomentum = useRef(false);

  // fetch one page
  const loadPage = async (nextPage: number, replace = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const status = tabToStatus(tab);
      const res = await getLeenkList(nextPage, PAGE_SIZE, status); // LeenkListResponse
      const pageItems = res.leenks ?? [];
      const reachedEnd = pageItems.length < PAGE_SIZE; // infer end by size

      setData((prev) => (replace ? pageItems : [...prev, ...pageItems]));
      setHasMore(!reachedEnd);
      setPage(nextPage);
    } catch (e) {
      if (__DEV__) console.warn('Failed to fetch leenks:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // initial + tab change -> reset & fetch first page
  useEffect(() => {
    setData([]);
    setHasMore(true);
    setPage(0);
    loadPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    await loadPage(0, true);
  };

  // infinite scroll
  const onEndReached = () => {
    if (onEndReachedCalledDuringMomentum.current) return;
    if (!loading && hasMore) {
      onEndReachedCalledDuringMomentum.current = true;
      loadPage(page + 1);
    }
  };

  return (
    <ContainerWithNoPadding>
      <View style={{ paddingHorizontal: FEED_PADDING * width }}>
        <Header LeftSection="LOGO" RightSection="BELL" />
        <TabMenu
          type="leenk"
          activeTab={tab}
          onTabChange={(newTab: string) => {
            if (newTab === 'all' || newTab === 'open' || newTab === 'close') {
              setTab(newTab);
            }
          }}
        />
      </View>

      <List
        data={data}
        keyExtractor={(item) => String(item.leenkId)}
        renderItem={({ item }) => <LeenkListItem item={item} />}
        ItemSeparatorComponent={() => <Separator />}
        showsVerticalScrollIndicator
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.6}
        onEndReached={onEndReached}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        ListFooterComponent={
          loading ? (
            <FooterLoading />
          ) : !hasMore ? (
            <FooterEnd>끝이에요</FooterEnd>
          ) : null
        }
      />
    </ContainerWithNoPadding>
  );
}

const List = styled.FlatList.attrs({
  contentContainerStyle: {
    paddingBottom: height * 20,
    paddingHorizontal: FEED_PADDING * width,
  },
  // NOTE: keep default styles
})`` as unknown as typeof import('react-native').FlatList<Leenk>;

const Separator = styled.View`
  height: ${height * 8}px;
`;

const FooterLoading = styled.ActivityIndicator.attrs({
  size: 'small',
  color: colors.primary ?? '#888',
})`
  margin: ${height * 8}px 0;
`;

const FooterEnd = styled.Text`
  text-align: center;
  color: ${colors.text?.[3] ?? '#999'};
  padding: ${height * 8}px 0;
  font-size: 12px;
`;
