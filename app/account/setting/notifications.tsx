import { BackArrowIcon } from '@/assets';
import { Header } from '@/components';
import MyPageButton from '@/components/mypage/MypageButton';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export default function AccountStatusPage() {
  const router = useRouter();

  // ✅ 상태 관리
  const [feedLike, setFeedLike] = useState(false);
  const [newLinkPost, setNewLinkPost] = useState(false);
  const [newFeedPost, setNewFeedPost] = useState(false);
  const [linkJoinRequest, setLinkJoinRequest] = useState(false);

  return (
    <Container>
      <Header
        LeftSection={
          <TouchableOpacity onPress={() => router.back()}>
            <BackArrowIcon />
          </TouchableOpacity>
        }
        TitleSection={
          <Text
            style={{
              fontWeight: '700',
              fontSize: fontSize.lg,
              fontFamily: fonts.Regular,
              lineHeight: lineHeight.l,
            }}
          >
            계정 관리
          </Text>
        }
      />
      <MarginContainer>
        <MyPageButton
          text="피드 좋아요"
          type="toggle"
          isToggleOn={feedLike}
          onToggle={() => setFeedLike((prev) => !prev)}
        />
        <MyPageButton
          text="링크 새 게시물"
          type="toggle"
          isToggleOn={newLinkPost}
          onToggle={() => setNewLinkPost((prev) => !prev)}
        />
        <MyPageButton
          text="피드 새 게시물"
          type="toggle"
          isToggleOn={newFeedPost}
          onToggle={() => setNewFeedPost((prev) => !prev)}
        />
        <MyPageButton
          text="링크 참여자 신청 시"
          type="toggle"
          isToggleOn={linkJoinRequest}
          onToggle={() => setLinkJoinRequest((prev) => !prev)}
        />
      </MarginContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  padding: ${28 * height}px ${20 * width}px;
`;

const MarginContainer = styled.View`
  margin-top: ${12 * height}px;
  gap: ${8 * height}px;
`;
