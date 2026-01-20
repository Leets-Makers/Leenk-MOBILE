import { CustomButton, Header } from '@/components';
import ProfileTitleText from '@/components/signup/ProfileTitleText';
import UserCard from '@/components/signup/UserCard';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { useProfileStore } from '@/stores/profileStore';
import { Position } from '@/constants/Position';
import { useBlockBackHandler } from '@/hooks/useBlockBackHandler';
import { useToastStore } from '@/stores/toastStore';
import { clearAllTokens } from '@/utils/tokenStorage';

export default function VerifyPage() {
  useBlockBackHandler({ block: true });

  const router = useRouter();
  const { name, cardinal, position, reset } = useProfileStore();
  const { showToast } = useToastStore();

  const handleCancel = async () => {
    try {
      await clearAllTokens();
    } catch (e) {
      if (__DEV__) console.error('토큰 정리 실패:', e);
    }
    reset();
    showToast('관리자에게 문의해주세요.', 'error');
    router.replace('/');
  };

  const handleRight = () => {
    router.push('/signup/profile');
  };

  return (
    <Container>
      <ProfileTitleText>너의 계정이 맞는지 확인해 줘</ProfileTitleText>

      {name && cardinal && position && typeof cardinal === 'number' && (
        <UserCard
          name={name}
          cardinal={cardinal}
          position={position as Position}
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
            marginBottom: 10 * height,
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
  padding-top: ${44 * height}px;
`;

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: ${44 * height}px;
`;
