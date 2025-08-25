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
import { useUserStore } from '@/stores/userStore';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useFocusEffect } from 'expo-router';

const PAGE_SIZE = 10;
const tabToStatus = (tab: 'all' | 'open' | 'close') =>
  tab === 'all' ? 'ALL' : tab === 'open' ? 'OPEN' : 'CLOSED';

export default function LeenkPage() {
  const [tab, setTab] = useState<'all' | 'open' | 'close'>('all');

  const [data, setData] = useState<Leenk[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const didMountRef = useRef(false);

  const { userInfo: fetchedUserInfo, refetch } = useUserInfo();
  const { userInfo, setUserInfo } = useUserStore();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (fetchedUserInfo && !userInfo) {
      setUserInfo(fetchedUserInfo);
    }
  }, [fetchedUserInfo, userInfo, setUserInfo]);

  // 페이지 변경 시 정보 업데이트
  useFocusEffect(
    React.useCallback(() => {
      if (didMountRef.current) {
        // 화면으로 복귀 시: 목록 리프레시
        setHasMore(true);
        setPage(0);
        onEndReachedCalledDuringMomentum.current = false;
        onRefresh(); // loadPage(0, true) 호출됨
      } else {
        // 첫 포커스(초기 진입)는 건너뛰기
        didMountRef.current = true;
      }
    }, [tab]),
  );

  // 중복 호출 방지
  const onEndReachedCalledDuringMomentum = useRef(false);

  // 첫 페이지 로드
  const loadPage = async (nextPage: number, replace = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const status = tabToStatus(tab);
      const res = await getLeenkList(nextPage, PAGE_SIZE, status);
      const pageItems = res.data.leenks ?? [];
      const reachedEnd = pageItems.length < PAGE_SIZE;

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

  // 초기화 및 탭 관리
  useEffect(() => {
    setData([]);
    setHasMore(true);
    setPage(0);
    loadPage(0, true);
  }, [tab]);

  // 스크롤 당겨서 재호출
  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    await loadPage(0, true);
  };

  // 무한스크롤
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
            <FooterEnd></FooterEnd>
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
})`` as unknown as typeof import('react-native').FlatList<Leenk>;

const Separator = styled.View`
  height: ${height * 8}px;
`;

// TODO: 마지막 게시물 표시 변경
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
