import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import FloatingHeart from './FloatingHeart';
import { HeartIcon } from '@/assets';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { radius, width, height } from '@/theme/globalStyles';
import { getNumberWithComma } from '@/utils';
import { Badge, UserListModal } from '@/components';
import { FeedReactedUser } from '@/types/feed';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { getFeedReactions } from '@/api/feed/feed.api';
import useReactionDebounce from '@/hooks/useReactionDebounce';
import { useToastStore } from '@/stores/toastStore';
import { useModalStore } from '@/stores/modalStore';
import useFlushOnExit from '@/hooks/useFlushonExit';

type HeartData = {
  id: number;
  color?: string;
};

interface HeartButtonProps {
  feedId: number;
  totalReactionCount: number;
  authorId: number;
  currentUserId: number | undefined;
  flushOnExit?: boolean;
}

export default function HeartButton({
  feedId,
  totalReactionCount,
  authorId,
  currentUserId,
  flushOnExit,
}: HeartButtonProps) {
  const [hearts, setHearts] = useState<HeartData[]>([]);
  const [reactedUsers, setReactedUsers] = useState<FeedReactedUser[]>([]);
  const [totalReaction, setTotalReaction] = useState(totalReactionCount);
  const { modalType, openModal, closeModal, payload } = useModalStore();
  const { showToast } = useToastStore();

  const isReactionModalOpen =
    modalType === 'feedReaction' && payload?.feedId === feedId;

  const {
    count: localCount,
    increaseReaction,
    flush,
  } = useReactionDebounce(feedId, 500, (reactionCount) => {
    setTotalReaction((prev) => prev + reactionCount);
  });

  useFlushOnExit(flushOnExit ?? false, flush, localCount);

  const heartScale = useSharedValue(1);
  const outlineScale = useSharedValue(0.8);
  const outlineOpacity = useSharedValue(0);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const outlineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: outlineScale.value }],
    opacity: outlineOpacity.value,
  }));

  // 하트 클릭 시 실행함수
  const handlePress = () => {
    if (authorId === currentUserId) {
      showToast('내 피드에는 공감할 수 없어!', 'error');
      return;
    }

    triggerHeartAnimation();
    increaseReaction();
  };

  const triggerHeartAnimation = () => {
    //햅틱 추가
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    outlineOpacity.value = 0.5;
    outlineScale.value = 0.8;

    outlineScale.value = withTiming(1.8, { duration: 400 });
    outlineOpacity.value = withTiming(0, { duration: 400 });

    heartScale.value = withSequence(
      withTiming(0.85, { duration: 100 }),
      withTiming(1.15, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );

    const newHeart: HeartData = {
      id: Date.now(),
    };
    setHearts((prev) => [...prev, newHeart]);
  };

  const handleComplete = (id: number) => {
    setHearts((prev) => prev.filter((heart) => heart.id !== id));
  };

  const handleOpenReactionModal = async () => {
    try {
      const res = await getFeedReactions(feedId);
      setReactedUsers(res);
      openModal('feedReaction', null, { feedId });
    } catch (error) {
      console.error('공감한 사람 목록 조회 실패:', error);
      showToast('공감한 사람 목록 조회에 실패했어.', 'error');
    }
  };

  return (
    <View>
      {hearts.map((heart) => (
        <FloatingHeartWrapper key={heart.id}>
          <FloatingHeart
            color={heart.color}
            onComplete={() => handleComplete(heart.id)}
          />
        </FloatingHeartWrapper>
      ))}
      <HeartWithBadge>
        {/* 하트 버튼 */}
        <Pressable
          onPress={handlePress}
          style={{
            bottom: 16,
            alignSelf: 'center',
          }}
        >
          <Circle>
            <OutlineWrapper style={outlineAnimatedStyle}>
              <HeartIcon width={28} height={28} />
            </OutlineWrapper>

            {/* 기본 하트 */}
            <Animated.View style={heartStyle}>
              <HeartIcon width={28} height={28} />
            </Animated.View>
          </Circle>
        </Pressable>

        {/* 뱃지 버튼 */}
        <Pressable onPress={handleOpenReactionModal}>
          <BadgeWrapper>
            <Badge
              label={getNumberWithComma(totalReaction + localCount)}
              variant="white"
            />
          </BadgeWrapper>
        </Pressable>
      </HeartWithBadge>

      <UserListModal
        visible={isReactionModalOpen}
        title="공감한 Leets"
        list={reactedUsers}
        onClose={closeModal}
      />
    </View>
  );
}

const HeartWithBadge = styled.View`
  align-items: center;
  padding-right: ${10 * width}px;
`;

const Circle = styled.View`
  width: ${44 * width}px;
  height: ${44 * height}px;
  background-color: ${colors.white};
  border-radius: ${radius.full}px;
  align-items: center;
  justify-content: center;
`;

const BadgeWrapper = styled.View`
  margin-top: ${-7 * height}px;
`;

const FloatingHeartWrapper = styled.View`
  position: absolute;
  bottom: ${9 * height}px;
  z-index: 100;
`;

const OutlineWrapper = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;
