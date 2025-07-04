import { CheckBox, Header } from '@/components';
import ProfileTitleText from '@/components/signup/ProfileTitleText';
import { StyledSubText } from './profile';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import { useState } from 'react';

export default function TermsPage() {
  const [allCheck, setAllCheck] = useState(false);
  const [serviceCheck, setServiceCheck] = useState(false);
  const [infoCheck, setInfoCheck] = useState(false);
  return (
    <Container>
      <Header />
      <ProfileTitleText>
        어서와 Leenk는 처음이지? 즐기기 전에 약속 하나만 하자
      </ProfileTitleText>
      <StyledSubText>
        모든 항목에 동의하면 링크를 신나게 이용할 수 있어.
      </StyledSubText>
      <AllAgreeButton>
        <CheckBox checked={allCheck} />
        <ButtonText>모두 동의할게</ButtonText>
      </AllAgreeButton>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  padding-horizontal: ${20 * width}px;
`;

const AllAgreeButton = styled.Pressable`
  width: 100%;
  background-color: ${colors.bg[3]};
  border-radius: ${radius.md};
  padding: ${8 * height}px ${12 * width}px;
  flex-direction: row;
  gap: ${4 * width}px;
`;

const ButtonText = styled.Text`
  color: ${colors.text[1]};
  font-size: ${fontSize.md};
  font-family: ${fonts.Bold};
  line-height: ${lineHeight.m};
`;
