import styled from 'styled-components/native';
import { ViewProps } from 'react-native';
import { fonts, fontSize, height, lineHeight } from '@/theme/globalStyles';

import { LogoText } from '@/assets';
import {
  BackButton,
  BellButton,
  SettingButton,
  KebabButton,
} from '@/components';

interface HeaderProps extends ViewProps {
  LeftSection?: 'LOGO' | 'BACK' | 'NONE';
  RightSection?: 'BELL' | 'SETTING' | 'KEBAB' | 'NONE';
  isBackWhite?: boolean; // 하얀색 뒤로가기
  children?: React.ReactNode;
  signUpBackPress?: () => void;
  kebabPress?: () => void;
  kebabColor?: 'white' | 'black';
}

export default function Header({
  LeftSection = 'BACK',
  isBackWhite = false,
  signUpBackPress,
  children,
  RightSection = 'NONE',
  kebabPress,
  kebabColor,
  ...props
}: HeaderProps) {
  return (
    <Container {...props}>
      <Side>
        {LeftSection === 'LOGO' && <LogoText width={65} height={24} />}
        {LeftSection === 'BACK' && (
          <BackButton
            isBackWhite={isBackWhite}
            signUpBackPress={signUpBackPress}
          />
        )}
        {LeftSection === 'NONE' && <None />}
      </Side>

      <TitleWrapper>
        <TitleText>{children}</TitleText>
      </TitleWrapper>

      <Side>
        {RightSection === 'BELL' && <BellButton />}
        {RightSection === 'SETTING' && <SettingButton />}
        {RightSection === 'KEBAB' && (
          <KebabButton handleKebab={kebabPress} color={kebabColor} />
        )}
        {RightSection === 'NONE' && <None />}
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

const None = styled.View`
  width: 24px;
`;
