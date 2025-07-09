import { Header } from '@/components';
import MyPageButton from '@/components/mypage/MypageButton';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import styled from 'styled-components/native';

export default function SettingNotificationsPage() {
  const router = useRouter();

  const [toggles, setToggles] = useState({
    feedLike: false,
    newLinkPost: false,
    newFeedPost: false,
    linkJoinRequest: false,
  });

  const toggleKeys = [
    { key: 'feedLike', label: '피드 좋아요' },
    { key: 'newLinkPost', label: '링크 새 게시물' },
    { key: 'newFeedPost', label: '피드 새 게시물' },
    { key: 'linkJoinRequest', label: '링크 참여자 신청 시' },
  ] as const;

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Container>
      <Header>알림 설정</Header>
      <MarginContainer>
        {toggleKeys.map(({ key, label }) => (
          <MyPageButton
            key={key}
            text={label}
            type="toggle"
            isToggleOn={toggles[key]}
            onToggle={() => handleToggle(key)}
          />
        ))}
      </MarginContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  padding-horizontal: ${20 * width}px;
`;

const MarginContainer = styled.View`
  margin-top: ${12 * height}px;
  gap: ${8 * height}px;
`;
