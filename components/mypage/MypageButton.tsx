import { RightArrowIcon } from '@/assets';
import colors from '@/theme/color';
import { fonts, fontSize, width } from '@/theme/globalStyles';
import styled from 'styled-components/native';
import Toggle from '@/components/common/Toggle';

type MyPageButtonType = 'arrow' | 'toggle' | 'none';

interface MyPageButtonProps {
  text: string;
  type?: MyPageButtonType;
  onPress?: () => void;
  isToggleOn?: boolean;
  onToggle?: () => void;
}

export default function MyPageButton({
  text,
  type = 'arrow',
  onPress,
  isToggleOn = false,
  onToggle,
}: MyPageButtonProps) {
  return (
    <Container onPress={onPress}>
      <Title onlyText={type === 'none'}>{text}</Title>

      {type === 'arrow' && <RightArrowIcon />}
      {type === 'toggle' && (
        <Toggle isOn={isToggleOn} onToggle={onToggle ?? (() => {})} />
      )}
    </Container>
  );
}

const Container = styled.Pressable`
  flex-direction: row;
  background-color: ${colors.white};
  width: 100%;
  border-radius: 13px;
  padding: ${14 * width}px;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text<{ onlyText: boolean }>`
  font-size: ${fontSize.md}px;
  font-family: ${fonts.Bold};
  color: ${colors.text[1]};
  text-align: ${({ onlyText }) => (onlyText ? 'left' : 'auto')};
  flex: 1;
`;
