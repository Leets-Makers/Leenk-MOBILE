import styled from 'styled-components/native';
import { width, height } from '@/theme/globalStyles';
import colors from '@/theme/color';
import { Pressable } from 'react-native';

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

export default function Toggle({ isOn, onToggle }: ToggleProps) {
  return (
    <ToggleWrapper onPress={onToggle}>
      <Track isOn={isOn}>
        <Thumb isOn={isOn} />
      </Track>
    </ToggleWrapper>
  );
}

const ToggleWrapper = styled(Pressable)`
  width: ${50 * width}px;
  height: ${28 * height}px;
  justify-content: center;
`;

const Track = styled.View<{ isOn: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: ${24 * height}px;
  background-color: ${({ isOn }) => (isOn ? colors.primary : colors.gray[400])};
  padding-horizontal: ${4 * width}px;
  justify-content: center;
`;

const Thumb = styled.View<{ isOn: boolean }>`
  width: ${22 * height}px;
  height: ${22 * height}px;
  border-radius: ${12 * height}px;
  background-color: ${colors.white};
  align-self: ${({ isOn }) => (isOn ? 'flex-end' : 'flex-start')};
`;
