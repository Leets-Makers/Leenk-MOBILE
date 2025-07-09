import styled from 'styled-components/native';
import colors from '@/theme/color';
import { height, width, fontSize, fonts, radius } from '@/theme/globalStyles';
import { HeartReactionIcon } from '@/assets';
import { getNumberWithComma } from '@/utils';

interface MyTotalReactionCountProps {
  totalReactionCount: number;
}

export default function MyTotalReactionCount({
  totalReactionCount,
}: MyTotalReactionCountProps) {
  return (
    <Container>
      <LeftSection>
        <HeartReactionIcon />
        <Label>받은 공감</Label>
      </LeftSection>
      <Count>{getNumberWithComma(totalReactionCount)}</Count>
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
  padding: ${16 * height}px ${20 * width}px;
  margin-top: ${6 * height}px;
  background-color: ${colors.white};
  border-radius: ${radius.md}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Label = styled.Text`
  margin-left: ${8 * width}px;
  font-size: ${fontSize.md}px;
  font-family: ${fonts.Bold};
  color: ${colors.black};
`;

const Count = styled.Text`
  font-size: ${fontSize.md}px;
  font-family: ${fonts.Bold};
  color: ${colors.black};
`;
