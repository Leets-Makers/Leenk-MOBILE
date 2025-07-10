import { Header } from '@/components';
import MyPageButton from '@/components/mypage/MypageButton';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { useState } from 'react';
import styled from 'styled-components/native';
import { patchNotificationsSetting } from '@/api/users/notification.api';

export default function SettingNotificationsPage() {
  const [toggles, setToggles] = useState({
    feedLike: false,
    newFeedPost: false,
  });

  const toggleKeys = [
    { key: 'feedLike', label: '피드 좋아요', apiKey: 'newReactionNotify' },
    { key: 'newFeedPost', label: '피드 새 게시물', apiKey: 'newFeedNotify' },
  ] as const;

  const handleToggle = async (key: keyof typeof toggles, apiKey: string) => {
    const newValue = !toggles[key];
    setToggles((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    try {
      await patchNotificationsSetting({ [apiKey]: newValue });
    } catch (error) {
      console.error('Failed to update notification setting:', error);
      // 실패 시 다시 원래 값으로 되돌리기
      setToggles((prev) => ({
        ...prev,
        [key]: !newValue,
      }));
    }
  };

  return (
    <Container>
      <Header>알림 설정</Header>
      <MarginContainer>
        {toggleKeys.map(({ key, label, apiKey }) => (
          <MyPageButton
            key={key}
            text={label}
            type="toggle"
            isToggleOn={toggles[key]}
            onToggle={() => handleToggle(key, apiKey)}
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
