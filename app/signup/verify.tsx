import { BackArrowIcon } from '@/assets';
import { CustomButton, Header } from '@/components';
import TitleText from '@/components/signup/TitleText';
import UserCard from '@/components/signup/UserCard';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

export default function VerifyPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };
  const handleRight = () => {
    router.push('/signup/profile');
  };

  const mockUserData = {
    cardinal: 5,
    name: '이한별',
    position: 'D',
  } as const;

  return (
    <Container>
      <Header
        LeftSection={
          <TouchableOpacity onPress={() => router.back()}>
            <BackArrowIcon />
          </TouchableOpacity>
        }
      />
      <TitleText>너의 계정이 맞는지 확인해 줘</TitleText>

      <UserCard
        cardinal={mockUserData.cardinal}
        name={mockUserData.name}
        position={mockUserData.position}
      />

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
  padding: ${29 * height}px ${20 * width}px;
`;

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: ${44 * height}px;
`;
