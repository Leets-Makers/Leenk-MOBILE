import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { uploadFeedReactions } from '@/api/feed/feed.api';
import { useToastStore } from '@/stores/toastStore';
import { AxiosError } from 'axios';

export default function useReactionDebounce(
  feedId: number,
  debounceTime = 500,
  onSuccess?: (reactionCount: number) => void,
) {
  const [count, setCount] = useState(0);
  const { showToast } = useToastStore();

  // 1) 즉시 전송 함수 (공통 로직)
  const performSend = useCallback(
    async (reactionCount: number) => {
      if (reactionCount <= 0) return;

      try {
        // send
        await uploadFeedReactions(feedId, reactionCount);
        onSuccess?.(reactionCount);
      } catch (e) {
        const err = e as AxiosError;
        if (err.response?.status === 403) {
          showToast('내 피드에는 공감할 수 없어!', 'error');
        } else {
          showToast('공감하기에 실패했어!', 'error');
        }
        // 디버깅 로그는 필요 시 유지
        console.error('[Reaction API Error]', err?.response ?? err);
      } finally {
        // 전송이 실제로 끝난 뒤 카운트 리셋
        setCount(0);
      }
    },
    [feedId, onSuccess, showToast],
  );

  // 2) 디바운스 래퍼 (performSend를 감쌈)
  const debouncedSend = useMemo(
    () =>
      debounce((n: number) => {
        void performSend(n);
      }, debounceTime),
    [performSend, debounceTime],
  );

  // count 변경 시 디바운스 호출
  useEffect(() => {
    if (count > 0) debouncedSend(count);
  }, [count, debouncedSend]);

  // 언마운트/의존성 변경 시 예약 취소
  useEffect(() => {
    return () => debouncedSend.cancel();
  }, [debouncedSend]);

  // +1
  const increaseReaction = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  // 3) flush: 예약 취소 후, 한 번만 즉시 전송
  const flush = useCallback(() => {
    debouncedSend.cancel();
    if (count > 0) {
      void performSend(count);
    }
  }, [debouncedSend, performSend, count]);

  return { count, increaseReaction, flush };
}
