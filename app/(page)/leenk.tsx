import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { width, height } from '@/theme/globalStyles';
import { CustomButton, Header, Loading } from '@/components';
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

import BottomSheetModal from '@/components/Modal/BottomSheetModal';
import { SubText, TitleText } from '@/components/OnBoarding';
import { CongratsIcon } from '@/assets';
import useFirstLaunch from '@/hooks/useFirstLaunch';

const FOOTER_SPACER = 10 * height;
const PAGE_SIZE = 6;

const tabToStatus = (tab: 'all' | 'open' | 'close') =>
  tab === 'all' ? 'ALL' : tab === 'open' ? 'OPEN' : 'CLOSED';

export default function LeenkPage() {
  const [tab, setTab] = useState<'all' | 'open' | 'close'>('all');

  const [data, setData] = useState<Leenk[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pullRefreshing, setPullRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const didMountRef = useRef(false);
  const listRef = useRef<import('react-native').FlatList<Leenk>>(null);

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const { userInfo: fetchedUserInfo, refetch } = useUserInfo();
  const { userInfo, setUserInfo } = useUserStore();

  const firstLaunch = useFirstLaunch();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (fetchedUserInfo && !userInfo) {
      setUserInfo(fetchedUserInfo);
    }
  }, [fetchedUserInfo, userInfo, setUserInfo]);

  useEffect(() => {
    if (firstLaunch === true) {
      // 처음 방문이면 모달 표시
      setShowWelcomeModal(true);
    }
  }, [firstLaunch]);

  useFocusEffect(
    React.useCallback(() => {
      if (didMountRef.current) {
        setHasMore(true);
        setPage(0);
        onEndReachedCalledDuringMomentum.current = false;
        loadPage(0, true);
      } else {
        didMountRef.current = true;
      }
    }, [tab]),
  );

  const onEndReachedCalledDuringMomentum = useRef(false);

  const loadPage = async (nextPage: number, replace = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const status = tabToStatus(tab);
      const res = await getLeenkList(nextPage, PAGE_SIZE, status);
      const pageItems = res.leenks ?? [];
      const reachedEnd = pageItems.length < PAGE_SIZE;

      setData((prev) => (replace ? pageItems : [...prev, ...pageItems]));
      setHasMore(!reachedEnd);
      setPage(nextPage);
    } catch (e) {
      if (__DEV__) console.warn('Failed to fetch leenks:', e);
    } finally {
      setLoading(false);
      onEndReachedCalledDuringMomentum.current = false;
    }
  };

  useEffect(() => {
    setData([]);
    setHasMore(true);
    setPage(0);
    onEndReachedCalledDuringMomentum.current = false;
    loadPage(0, true);
  }, [tab]);

  const onRefresh = async () => {
    // 사용자 제스처로만 호출되는 함수
    setPullRefreshing(true);
    setHasMore(true);
    onEndReachedCalledDuringMomentum.current = false;
    try {
      await loadPage(0, true);
    } finally {
      setPullRefreshing(false);
    }
  };

  const onEndReached = () => {
    if (onEndReachedCalledDuringMomentum.current) return;
    if (!loading && hasMore) {
      onEndReachedCalledDuringMomentum.current = true;
      loadPage(page + 1);
    }
  };

  // 초기 로딩 판단: 데이터 없고, page==0이고, 새로고침 중이 아닐 때
  const showInitialLoader =
    loading && !pullRefreshing && data.length === 0 && page === 0;

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

      {showInitialLoader ? (
        <Loading />
      ) : (
        <LeenkList
          ref={listRef}
          data={data}
          keyExtractor={(item) => String(item.leenkId)}
          renderItem={({ item }) => <LeenkListItem item={item} />}
          ItemSeparatorComponent={() => <Separator />}
          onEndReachedThreshold={0.3}
          onEndReached={onEndReached}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          refreshing={pullRefreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator
          ListFooterComponent={
            <View
              style={{ height: FOOTER_SPACER, opacity: loading ? 0.6 : 0 }}
            />
          }
        />
      )}
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
    </ContainerWithNoPadding>
  );
}

export const LeenkList = styled.FlatList.attrs({
  contentContainerStyle: {
    paddingBottom: height * 20,
    paddingHorizontal: FEED_PADDING * width,
  },
})`` as unknown as typeof import('react-native').FlatList<Leenk>;

export const Separator = styled.View`
  height: ${height * 8}px;
`;
