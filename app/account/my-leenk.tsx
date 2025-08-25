// MyLeenkPage.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { ContainerWithNoPadding } from './my-feed';
import { Header, Loading } from '@/components';
import { FEED_PADDING } from '@/constants';
import { width } from '@/theme/globalStyles';
import { LeenkList, Separator } from '../(page)/leenk';
import LeenkListItem from '@/components/leenk/LeenkListItem';
import { getMyLeenkList } from '@/api/leenk/leenk.get.api';
import { Leenk } from '@/types/leenk';

const PAGE_SIZE = 10;

export default function MyLeenkPage() {
  // 리스트 데이터 상태
  const [data, setData] = useState<Leenk[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 모멘텀 스크롤 중복 호출 방지용 ref
  const onEndReachedCalledDuringMomentum = useRef(false);

  // 특정 페이지 로드
  const loadPage = useCallback(
    async (nextPage: number, replace = false) => {
      // 이미 로딩 중이면 중복 호출 방지
      if (loading) return;

      setLoading(true);
      try {
        const res = await getMyLeenkList(nextPage, PAGE_SIZE);

        const pageItems: Leenk[] =
          (res as any)?.data?.leenks ?? (res as any)?.data?.content ?? [];

        // 다음 페이지가 있는지 여부 판단 (단순 길이 기반)
        const reachedEnd = pageItems.length < PAGE_SIZE;

        setData((prev) => (replace ? pageItems : [...prev, ...pageItems]));
        setHasMore(!reachedEnd);
        setPage(nextPage);
      } catch (e) {
        if (__DEV__) console.warn('참여한 링크 조회 실패:', e);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loading],
  );

  // 당겨서 새로고침
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    onEndReachedCalledDuringMomentum.current = false;
    await loadPage(0, true);
  }, [loadPage]);

  // 무한 스크롤
  const onEndReached = useCallback(() => {
    // 모멘텀 중복 호출 방지
    if (onEndReachedCalledDuringMomentum.current) return;
    if (!loading && hasMore) {
      onEndReachedCalledDuringMomentum.current = true;
      loadPage(page + 1);
    }
  }, [hasMore, loadPage, loading, page]);

  // 첫 페이지 자동 로드
  useEffect(() => {
    loadPage(0, true);
  }, [loadPage]);

  return (
    <ContainerWithNoPadding>
      <View style={{ paddingHorizontal: FEED_PADDING * width }}>
        <Header>참여한 모임</Header>
      </View>

      <LeenkList
        data={data}
        keyExtractor={(item) => String(item.leenkId)}
        renderItem={({ item }) => <LeenkListItem item={item} />}
        ItemSeparatorComponent={() => <Separator />}
        showsVerticalScrollIndicator
        // 새로고침
        refreshing={refreshing}
        onRefresh={onRefresh}
        // 무한 스크롤
        onEndReachedThreshold={0.6}
        onEndReached={onEndReached}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        // 푸터 (로딩 중, 더 이상 데이터 없음 표시를 필요에 맞게 교체 가능)
        ListFooterComponent={loading ? <Loading /> : !hasMore ? <View /> : null}
      />
    </ContainerWithNoPadding>
  );
}
