import { CustomButton, Header } from '@/components';
import ProfileTitleText from '@/components/signup/ProfileTitleText';
import UserCard from '@/components/signup/UserCard';
import { useUserInfo } from '@/hooks/useUserInfo';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

export default function VerifyPage() {
  const { userInfo, loading, error } = useUserInfo();

  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };
  const handleRight = () => {
    router.push('/signup/profile');
  };

  return (
    <Container>
      <Header />
      <ProfileTitleText>너의 계정이 맞는지 확인해 줘</ProfileTitleText>
      {error && <ErrorText>오류가 발생했어요!</ErrorText>}
      {userInfo && (
        <UserCard
          cardinal={userInfo.cardinal}
          name={userInfo.name}
          position={userInfo.position}
        />
      )}

      <ButtonContainer>
        <CustomButton
          variant="secondary"
          onPress={handleCancel}
          rounded="md"
          style={{
            width: 162.5 * width,
            height: 48 * height,
            marginRight: 10 * width,
          }}
        >
          아니야
        </CustomButton>

        <CustomButton
          variant="primary"
          onPress={handleRight}
          rounded="md"
          style={{
            width: 162.5 * width,
            height: 48 * height,
          }}
        >
          맞아
        </CustomButton>
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  align-items: center;
  position: relative;
  padding-horizontal: ${20 * width}px;
`;

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: ${44 * height}px;
`;

const ErrorText = styled.Text`
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l}px;
  font-family: ${fonts.Bold};
  color: ${colors.text[1]};
  text-align: center;
  margin-top: 30px;
`;
