import { useState, useEffect } from 'react';
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

interface StepperProps {
  value?: number;
  onChange?: (next: number) => void;
  min?: number;
  max?: number;
}

export default function Stepper({
  value,
  onChange,
  min = 3,
  max = 99,
}: StepperProps) {
  const [count, setCount] = useState(value ?? min);

  useEffect(() => {
    if (value !== undefined && value !== count) {
      setCount(value);
    }
  }, [value]);

  const update = (next: number) => {
    const clamped = Math.min(Math.max(next, min), max);
    setCount(clamped);
    onChange?.(clamped);
  };

  const handleIncrement = () => update(count + 1);
  const handleDecrement = () => update(count - 1);

  return (
    <Container>
      <RoundBtn onPress={handleDecrement} disabled={count <= min}>
        <IconWrapper>
          <MinusIcon color={colors.gray[900]} />
        </IconWrapper>
      </RoundBtn>

      <MemberNumberContainer>
        <CountText>{count.toString().padStart(2, '0')}</CountText>
      </MemberNumberContainer>

      <RoundBtn onPress={handleIncrement} disabled={count >= max}>
        <IconWrapper>
          <PlusIcon color={colors.gray[900]} />
        </IconWrapper>
      </RoundBtn>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${width * 12}px;
  margin-top: ${height * 8}px;
`;

const RoundBtn = styled.Pressable<{ disabled?: boolean }>`
  height: ${height * 48}px;
  width: ${width * 48}px;
  border-radius: 999px;
  background-color: ${({ disabled }) =>
    disabled ? colors.divider[1] : colors.divider[2]};
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.View`
  align-items: center;
  justify-content: center;
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
