import styled from 'styled-components/native';
import { fontSize, fonts, height, lineHeight } from '@/theme/globalStyles';
import colors from '@/theme/color';
import { ReactNode } from 'react';

type TitleTextProps = {
  children: ReactNode;
};

export default function ProfileTitleText({ children }: TitleTextProps) {
  return <StyledTitleText>{children}</StyledTitleText>;
}

const StyledTitleText = styled.Text`
  font-size: ${fontSize.xl}px;
  color: ${colors.text[1]};
  line-height: ${lineHeight.m}px;
  margin: ${29 * height}px 0 ${20 * height}px 0;
  font-family: ${fonts.ExtraBold};
  align-self: flex-start;
`;
