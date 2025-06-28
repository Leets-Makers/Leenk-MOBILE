// 게시판 리팩토링 후 삭제 예정
import { fonts, fontSize, lineHeight } from '@/theme/globalStyles';
import React from 'react';
import styled from 'styled-components/native';

interface TitleProps {
  text: string;
}

const StyledText = styled.Text`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l};
`;

const Title: React.FC<TitleProps> = ({ text }) => {
  return <StyledText>{text}</StyledText>;
};

export default Title;
