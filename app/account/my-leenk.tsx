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
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const pageRef = useRef(0);
  const onEndReachedCalledDuringMomentum = useRef(false);

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
        pageRef.current = nextPage;
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

  // 최초 1회만 호출
  useEffect(() => {
    pageRef.current = 0;
    loadPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 당겨서 새로고침
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    onEndReachedCalledDuringMomentum.current = false;
    pageRef.current = 0;
    await loadPage(0, true);
  }, [loadPage]);

  // 무한 스크롤 트리거
  const onEndReached = useCallback(() => {
    if (onEndReachedCalledDuringMomentum.current) return;
    if (!loading && hasMore) {
      onEndReachedCalledDuringMomentum.current = true;
      const next = pageRef.current + 1;
      loadPage(next);
    }
  }, [hasMore, loading, loadPage]);

  return (
    <ContainerWithNoPadding>
      <View style={{ paddingHorizontal: FEED_PADDING * width }}>
        <Header>참여한 모임</Header>
      </View>

      <SafeAreaView
        edges={['bottom']}
        style={{ flex: 1, paddingTop: 16 * height }}
      >
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
          initialNumToRender={PAGE_SIZE}
          ListFooterComponent={loading ? <View /> : !hasMore ? <View /> : null}
        />
      </SafeAreaView>
    </ContainerWithNoPadding>
  );
}
