import { useCallback, useEffect, useState } from 'react';
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

  const sendReactions = useCallback(
    debounce(async (reactionCount: number) => {
      if (reactionCount === 0) return;

      try {
        console.log('Reaction Count 서버로 전송:', reactionCount);
        await uploadFeedReactions(feedId, reactionCount);

        onSuccess?.(reactionCount);
      } catch (error) {
        const err = error as AxiosError;

        console.error('❌ Reaction API Error:', err);

        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
        } else if (err.request) {
          console.error('No response received. Request:', err.request);
        } else {
          console.error('Error setting up request:', err.message);
        }

        if (err.response?.status === 403) {
          showToast('내 피드에는 공감할 수 없어!', 'error');
        } else {
          showToast('공감하기에 실패했어!', 'error');
        }
      } finally {
        setCount(0);
      }
    }, debounceTime),
    [feedId, debounceTime, onSuccess],
  );

  useEffect(() => {
    if (count === 0) return;
    sendReactions(count);
  }, [count, sendReactions]);

  const increaseReaction = useCallback(() => {
    setCount((prev) => {
      const newCount = prev + 1;
      return newCount;
    });
  }, []);

  useEffect(() => {
    return () => {
      sendReactions.cancel();
    };
  }, [sendReactions]);

  return {
    count,
    increaseReaction,
    flush: () => {
      sendReactions.flush();
      if (count > 0) {
        sendReactions(count);
      }
    },
  };
}
