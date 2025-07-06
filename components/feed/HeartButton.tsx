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
import { generateMockReactedUsers } from '@/__mocks__/mockFeed';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { getFeedReactions } from '@/api/feed/feed.api';

type HeartData = {
  id: number;
  color?: string;
};

interface HeartButtonProps {
  feedId: number;
}

export default function HeartButton({ feedId }: HeartButtonProps) {
  const [hearts, setHearts] = useState<HeartData[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [reactedUsers, setReactedUsers] = useState<FeedReactedUser[]>([]);

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

  const handlePress = () => {
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

    //하트 생성
    const newHeart: HeartData = {
      id: Date.now(),
    };
    setHearts((prev) => [...prev, newHeart]);
    setCount((prev) => prev + 1);
  };

  const handleComplete = (id: number) => {
    setHearts((prev) => prev.filter((heart) => heart.id !== id));
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchReactedUsers = async () => {
      try {
        const res = await getFeedReactions(feedId);
        console.log('[getFeedReactions] 응답:', res);
        setReactedUsers(res);
      } catch (error) {
        console.error('공감한 사람 목록 조회 실패:', error);
      }
    };

    if (feedId) {
      fetchReactedUsers();
    }
  }, [feedId]);

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
        <Pressable onPress={handleOpenModal}>
          <BadgeWrapper>
            <Badge label={getNumberWithComma(count)} variant="white" />
          </BadgeWrapper>
        </Pressable>
      </HeartWithBadge>

      <UserListModal
        visible={isModalVisible}
        title="공감한 Leets"
        list={reactedUsers}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const HeartWithBadge = styled.View`
  align-items: center;
  padding-right: ${17 * width}px;
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
