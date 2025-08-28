// hooks/useLeenkList.ts
import { useCallback } from 'react';
import { useToastStore } from '@/stores/toastStore';
import { getOtherUserLeenkList } from '@/api/leenk/leenk.get.api';
import useLeenkInfiniteScroll from './useLeenkInfiniteScroll';
import { Leenk } from '@/types/leenk';

type LeenkListType = 'userLeenk'; // TODO: all, myLeenk 추가해서 리팩토링

export interface UseLeenkListOptions {
  type: LeenkListType;
  userId?: number;
  pageSize?: number;
}

export default function useLeenkList({
  type,
  userId,
  pageSize = 10,
}: UseLeenkListOptions) {
  const { showToast } = useToastStore();

  const fetchLeenks = useCallback(
    async (pageNumber: number, pageSizeArg: number) => {
      console.log('[useLeenkList] call', {
        type,
        userId,
        pageNumber,
        pageSizeArg,
      });
      try {
        if (type !== 'userLeenk') throw new Error('지원하지 않는 타입입니다.');
        if (!userId || Number.isNaN(userId)) {
          // 아직 userId 준비 전엔 요청하지 않음(안전 장치)
          return {
            data: [] as Leenk[],
            pageable: {
              pageNumber,
              pageSize: pageSizeArg,
              numberOfElements: 0,
              hasNext: true,
            } as any,
          };
        }

        const res = await getOtherUserLeenkList(
          userId,
          pageNumber,
          pageSizeArg,
        );
        return { data: res.leenks as Leenk[], pageable: res.pageable };
      } catch (err) {
        console.error('모임 목록 조회 실패:', err);
        showToast('모임 목록 조회에 실패했어!', 'error');
        throw err;
      }
    },
    [type, userId, showToast],
  );

  const enabled = !!userId && Number.isFinite(userId);

  return useLeenkInfiniteScroll<Leenk>({
    fetchFunction: fetchLeenks,
    pageSize,
    enabled,
  });
}
