import styled from 'styled-components/native';
import {
  fontSize,
  fonts,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import colors from '@/theme/color';
import { ReactNode } from 'react';

type TitleTextProps = {
  children: ReactNode;
};

export default function TitleText({ children }: TitleTextProps) {
  return <StyledTitleText>{children}</StyledTitleText>;
}

const StyledTitleText = styled.Text`
  font-size: ${fontSize.xl}px;
  font-weight: 700;
  color: ${colors.text[1]};
  line-height: ${lineHeight.m}px;
  margin-bottom: ${20 * height}px;
  font-family: ${fonts.Bold};
  align-self: flex-start;
`;
