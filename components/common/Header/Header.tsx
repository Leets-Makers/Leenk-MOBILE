import styled from 'styled-components/native';
import { ViewProps } from 'react-native';
import { height, width } from '@/theme/globalStyles';

interface HeaderProps extends ViewProps {
  LeftSection?: React.ReactNode;
  TitleSection?: React.ReactNode;
  RightSection?: React.ReactNode;
}

export default function Header({
  LeftSection,
  TitleSection,
  RightSection,
  ...props
}: HeaderProps) {
  return (
    <Container {...props}>
      <Side>{LeftSection}</Side>

      <TitleWrapper>{TitleSection}</TitleWrapper>

      <Side>{RightSection}</Side>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${60 * height}px;
  padding-horizontal: ${16 * width}px;
`;

const Side = styled.View`
  height: 100%;
  justify-content: center;
`;

const TitleWrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`;
