import styled from 'styled-components/native';
import { TouchableOpacity, ViewProps } from 'react-native';
import { fonts, fontSize, height, lineHeight } from '@/theme/globalStyles';
import { BackArrowIcon } from '@/assets';
import { useRouter } from 'expo-router';

interface HeaderProps extends ViewProps {
  isBack?: boolean; // 뒤로가기
  TitleSection?: string;
  LeftSection?: React.ReactNode;
  RightSection?: React.ReactNode;
  onRightPress?: () => void;
}

export default function Header({
  isBack = false,
  LeftSection,
  TitleSection,
  RightSection,
  onRightPress,
  ...props
}: HeaderProps) {
  const router = useRouter();

  return (
    <Container {...props}>
      <Side>
        {isBack ? (
          <TouchableOpacity onPress={() => router.back()}>
            <BackArrowIcon />
          </TouchableOpacity>
        ) : (
          LeftSection
        )}
      </Side>

      <TitleWrapper>
        {TitleSection && <TitleText>{TitleSection}</TitleText>}
      </TitleWrapper>

      <Side>
        {RightSection && (
          <TouchableOpacity onPress={onRightPress}>
            {RightSection}
          </TouchableOpacity>
        )}
      </Side>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${44 * height}px;
  margin-top: ${16 * height}px;
`;

const Side = styled.View`
  height: 100%;
  justify-content: center;
`;

const TitleWrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.Text`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l};
`;
