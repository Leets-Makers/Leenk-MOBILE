// hooks/useLeenkList.ts
import { useCallback } from 'react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { useToastStore } from '@/stores/toastStore';
import { getOtherUserLeenkList } from '@/api/leenk/leenk.get.api';
import useLeenkInfiniteScroll from './useLeenkInfiniteScroll';

type LeenkListType = 'userLeenk';
//   | 'myLeenk'      // TODO: 추후 추가 리팩토링
//   | 'all';

export type LeenkRow = { leenkId: number } & Record<string, any>;

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
      try {
        let res: any;

        switch (type) {
          case 'userLeenk': {
            if (!userId) throw new Error('userId가 필요합니다.');
            res = await getOtherUserLeenkList(userId, pageNumber, pageSizeArg);
            break;
          }

          //   // --- TODO:  추후 추가 예정 ---
          //   case 'myLeenk':
          //   case 'all':
          //   // -------------------------------------

          default:
            throw new Error('지원하지 않는 타입입니다.');
        }

        // useInfiniteScroll이 feedId 기반으로 de-dup 하므로 leenkId → feedId 매핑
        const list: LeenkRow[] = (res?.leenks ?? res?.data ?? []).map(
          (it: any) => ({ ...it, feedId: it.leenkId }),
        );

        return {
          data: list,
          pageable: res?.pageable,
        };
      } catch (err) {
        console.error('모임 목록 조회 실패:', err);
        showToast('모임 목록 조회에 실패했어!', 'error');
        throw err;
      }
    },
    [type, userId, showToast],
  );

  return useLeenkInfiniteScroll<{ leenkId: number }>({
    fetchFunction: fetchLeenks,
    pageSize,
  });
}
