import { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import { uploadFeedReactions } from '@/api/feed/feed.api';

export default function useReactionDebounce(
  feedId: number,
  debounceTime = 1000,
) {
  const [count, setCount] = useState(0);

  const sendReactions = useCallback(
    debounce(async (reactionCount: number) => {
      if (reactionCount === 0) return;
      try {
        console.log('Reaction Count 서버로 전송:', reactionCount);
        await uploadFeedReactions(feedId, reactionCount);
        console.log('피드 공감하기 응답 : ');
      } catch (error) {
        console.error('Reaction Count 서버 전송 실패:', error);
      } finally {
        setCount(0);
      }
    }, debounceTime),
    [feedId, debounceTime],
  );

  const increaseReaction = useCallback(() => {
    setCount((prev) => {
      const newCount = prev + 1;
      sendReactions(newCount); // debounce로 서버 요청
      return newCount;
    });
  }, [sendReactions]);

  useEffect(() => {
    return () => {
      sendReactions.cancel();
    };
  }, [sendReactions]);

  return {
    count,
    increaseReaction,
  };
}
