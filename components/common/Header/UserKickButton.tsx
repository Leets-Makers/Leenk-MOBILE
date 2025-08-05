import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import styled from 'styled-components/native';
import { useParticipantStore } from '@/stores/participantStore';

interface Props {
  handleKick?: () => void;
}

export default function UserKickButton({ handleKick }: Props) {
  const { selectedUsers } = useParticipantStore();

  return (
    <Container onPress={handleKick}>
      {!selectedUsers.length ? null : (
        <CountBadge>
          <CountText>{selectedUsers.length}</CountText>
        </CountBadge>
      )}
      <ButtonText>내보내기</ButtonText>
    </Container>
  );
}

const Container = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding: ${8 * height}px ${12 * width}px;
  background-color: ${colors.bg[2]};
  border-radius: 100px;
`;

const ButtonText = styled.Text`
  font-size: ${fontSize.sm}px;
  color: ${colors.text[1]};
  font-family: ${fonts.Bold};
  line-height: ${lineHeight.s}px;
`;

const CountBadge = styled.View`
  width: ${20 * width}px;
  height: ${20 * height}px;
  border-radius: ${10 * height}px;
  background-color: ${colors.primary};
  align-items: center;
  justify-content: center;
  margin-right: ${6 * width}px;
`;

const CountText = styled.Text`
  color: white;
  font-size: ${fontSize.sm}px;
  font-family: ${fonts.Bold};
  line-height: ${lineHeight.s}px;
`;
