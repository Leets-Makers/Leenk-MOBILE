import { Header } from '@/components';
import MyPageButton from '@/components/mypage/MypageButton';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

const settingItems = [
  { text: '알림 설정', route: '/account/setting/notifications' },
  { text: '의견 남기기', route: '/account/setting/help' },
  { text: '계정 관리', route: '/account/setting/account-status' },
] as const;

export default function SettingPage() {
  const router = useRouter();

  return (
    <Container>
      <Header>환경설정</Header>
      <MarginContainer>
        {settingItems.map((item) => (
          <MyPageButton
            key={item.route}
            text={item.text}
            onPress={() => router.push(item.route)}
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
