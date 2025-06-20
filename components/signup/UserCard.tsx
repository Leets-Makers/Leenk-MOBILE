import { FEIcon, DEIcon, BEIcon, PMIcon } from '@/assets';
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

type UserCardProps = {
  cardinal: number;
  name: string;
  position: string;
};

export default function UserCard({ cardinal, name, position }: UserCardProps) {
  const PositionIcon =
    position === 'FE'
      ? FEIcon
      : position === 'BE'
        ? BEIcon
        : position === 'D'
          ? DEIcon
          : PMIcon;

  return (
    <Container>
      <TextWrapper>
        <Bedge>{cardinal}기</Bedge>
        <NameText>{name}</NameText>
      </TextWrapper>

      <PositionIcon width={135 * width} height={135 * height} />
    </Container>
  );
}

const Container = styled.View`
  position: relative;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${colors.bg[4]};
  width: ${295 * width}px;
  height: ${165 * height}px;
  border-radius: ${radius.md}px;
  padding: ${20 * height}px ${20 * width}px;
`;

const TextWrapper = styled.View`
  justify-content: center;
`;

// // TODO: 공통 컴포넌트로 변경
const Bedge = styled.Text`
  background-color: ${colors.primaryLight};
  color: white;
  font-size: ${fontSize.sm}px;
  padding: 3px 10px;
  border-radius: 14px;
  align-self: flex-start;
`;

const NameText = styled.Text`
  font-size: ${fontSize['4xl']}px;
  font-weight: 500;
  color: ${colors.gray[900]};
  line-height: ${lineHeight.l}px;
  margin-top: ${8 * height}px;
  font-family: ${fonts.Regular};
`;
