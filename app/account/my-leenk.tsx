// MyLeenkPage.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { ContainerWithNoPadding } from './my-feed';
import { Header } from '@/components';
import { FEED_PADDING } from '@/constants';
import { height, width } from '@/theme/globalStyles';
import { LeenkList, Separator } from '../(page)/leenk';
import LeenkListItem from '@/components/leenk/LeenkListItem';
import { getMyLeenkList } from '@/api/leenk/leenk.get.api';
import { Leenk } from '@/types/leenk';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAGE_SIZE = 6;

export default function MyLeenkPage() {
  const [data, setData] = useState<Leenk[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onEndReachedCalledDuringMomentum = useRef(false);
  const listCanScroll = useRef(false); // 컨텐츠가 화면을 넘는지 여부

  // ✅ loadPage는 고정
  const loadPage = useCallback(
    async (nextPage: number, replace = false) => {
      if (loading) return;
      setLoading(true);
      try {
        const res = await getMyLeenkList(nextPage, PAGE_SIZE);
        const pageItems = res.leenks ?? [];
        const reachedEnd = pageItems.length < PAGE_SIZE;

        setData((prev) => (replace ? pageItems : [...prev, ...pageItems]));
        setHasMore(!reachedEnd);
        setPage(nextPage);
      } catch (e) {
        if (__DEV__) console.warn('Failed to fetch leenks:', e);
      } finally {
        setLoading(false);
        setRefreshing(false);
        onEndReachedCalledDuringMomentum.current = false;
      }
    },
    [loading],
  );

  // ✅ 최초 1회만 호출
  useEffect(() => {
    loadPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 당겨서 새로고침
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    onEndReachedCalledDuringMomentum.current = false;
    await loadPage(0, true);
  }, [loadPage]);

  // 무한 스크롤 트리거 (stale page 방지)
  const onEndReached = useCallback(() => {
    if (onEndReachedCalledDuringMomentum.current) return;
    if (!loading && hasMore) {
      onEndReachedCalledDuringMomentum.current = true;
      setPage((prev) => {
        const next = prev + 1;
        loadPage(next);
        return next; // 상태만 올리고 실제 fetch는 위에서
      });
    }
  }, [hasMore, loading, loadPage]);

  return (
    <ContainerWithNoPadding>
      <View style={{ paddingHorizontal: FEED_PADDING * width }}>
        <Header>참여한 모임</Header>
      </View>

      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <LeenkList
          data={data}
          keyExtractor={(item) => String(item.leenkId)}
          renderItem={({ item }) => <LeenkListItem item={item} />}
          ItemSeparatorComponent={() => <Separator />}
          onEndReachedThreshold={0.2}
          onEndReached={onEndReached}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator
          contentContainerStyle={{ paddingBottom: height * 20 }}
          // ✅ 컨텐츠가 화면보다 작으면 자동으로 더 로드
          onContentSizeChange={(w, h) => {
            // 이미 스크롤 가능하면 패스
            if (listCanScroll.current) return;
            // 화면 높이를 넘지 못했고, 더 불러올 수 있고, 현재 로딩 아님
            if (h < height * (1 - 0.01) && hasMore && !loading) {
              setPage((prev) => {
                const next = prev === 0 ? 1 : prev + 1; // 첫 페이지 직후 한 번 더
                loadPage(next);
                return next;
              });
            } else if (h >= height) {
              listCanScroll.current = true;
            }
          }}
          // 선택: 초기에 충분히 렌더
          initialNumToRender={PAGE_SIZE}
          ListFooterComponent={loading ? <View /> : !hasMore ? <View /> : null}
        />
      </SafeAreaView>
    </ContainerWithNoPadding>
  );
}
