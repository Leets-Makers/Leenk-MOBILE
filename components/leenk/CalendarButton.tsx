import { CalendarIcon } from '@/assets';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import styled from 'styled-components/native';

export default function CalendarButton() {
  return (
    <Container>
      <StyledText>모임 일시를 선택해줘</StyledText>
      <CalendarIcon />
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
  border-radius: ${radius.sm}px;
  padding-vertical: ${12 * height}px;
  padding-horizontal: ${12 * width}px;
  border-width: 2px;
  border-color: ${colors.divider[2]};
  border-style: solid;
  background-color: transparent;
`;

export const StyledText = styled.Text`
  width: 100%;
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l};
  font-family: ${fonts.Regular};
  color: #cdced6;
`;
