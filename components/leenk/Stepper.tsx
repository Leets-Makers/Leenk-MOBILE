import React, { useState } from 'react';
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
import { MinusIcon, PlusIcon } from '@/assets';

export default function Stepper() {
  const [count, setCount] = useState(3);

  const handleIncrement = () => {
    setCount((prev) => Math.min(prev + 1, 20));
  };

  const handleDecrement = () => {
    setCount((prev) => Math.max(prev - 1, 3));
  };

  return (
    <Container>
      <RoundBtn onPress={handleDecrement}>
        <BtnText>
          <MinusIcon />
        </BtnText>
      </RoundBtn>

      <MemberNumberContainer>
        <CountText>{count.toString().padStart(2, '0')}</CountText>
      </MemberNumberContainer>

      <RoundBtn onPress={handleIncrement}>
        <BtnText>
          <PlusIcon />
        </BtnText>
      </RoundBtn>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${width * 12}px;
`;

const RoundBtn = styled.Pressable`
  height: ${height * 48}px;
  width: ${width * 48}px;
  border-radius: 999px;
  background-color: ${colors.divider[2]};
  align-items: center;
  justify-content: center;
`;

const BtnText = styled.Text`
  color: ${colors.black};
  font-family: ${fonts.Bold};
  font-size: ${fontSize.xl}px;
  line-height: ${lineHeight.xl}px;
`;

const MemberNumberContainer = styled.View`
  height: ${height * 48}px;
  width: ${width * 80}px;
  border-radius: ${radius.sm}px;
  padding: 0 ${width * 12}px;
  border-width: 1.5px;
  border-color: ${colors.divider[2]};
  justify-content: center;
  align-items: center;
`;

const CountText = styled.Text`
  color: ${colors.black};
  font-family: ${fonts.Regular};
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l}px;
`;
