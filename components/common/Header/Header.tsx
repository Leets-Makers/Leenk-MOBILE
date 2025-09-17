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
import UserKickButton from './UserKickButton';

interface HeaderProps extends ViewProps {
  LeftSection?: 'LOGO' | 'BACK' | 'NONE';
  RightSection?: 'BELL' | 'SETTING' | 'KEBAB' | 'KICK' | 'NONE';
  isBackWhite?: boolean; // 하얀색 뒤로가기
  children?: React.ReactNode;
  signUpBackPress?: () => void;
  kebabPress?: () => void;
  kebabColor?: 'white' | 'black';
  rightDisabled?: boolean;
  leenkId?: number;
  isWebView?: boolean;
}

export default function Header({
  LeftSection = 'BACK',
  isBackWhite = false,
  signUpBackPress,
  children,
  RightSection = 'NONE',
  kebabPress,
  kebabColor,
  rightDisabled = false,
  leenkId = 0,
  isWebView = false,
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
        <TitleText $isWebView={isWebView}>{children}</TitleText>
      </TitleWrapper>

      <Side>
        {RightSection === 'BELL' && <BellButton />}
        {RightSection === 'SETTING' && <SettingButton />}
        {RightSection === 'KEBAB' && (
          <KebabButton handleKebab={kebabPress} color={kebabColor} />
        )}
        {RightSection === 'KICK' && (
          <UserKickButton
            leenkId={leenkId}
            handleKick={kebabPress}
            disabled={rightDisabled || !leenkId}
          />
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

const TitleWrapper = styled.View.attrs({ pointerEvents: 'none' })`
  position: absolute;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const TitleText = styled.Text<{ $isWebView: boolean }>`
  font-family: ${({ $isWebView }) => ($isWebView ? fonts.Regular : fonts.Bold)};
  font-size: ${({ $isWebView }) => ($isWebView ? fontSize.md : fontSize.lg)}px;
  line-height: ${({ $isWebView }) =>
    $isWebView ? lineHeight.m : lineHeight.l}px;
`;

const None = styled.View`
  width: 24px;
`;
