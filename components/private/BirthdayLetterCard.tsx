import ProfileImageWithFallback from '../feed/ProfileImageWithFallback';
import { fonts, fontSize, height, radius, width } from '@/theme/globalStyles';
import colors from '@/theme/color';
import styled from 'styled-components/native';

interface BirthdayLetterCardProps {
  username: string;
  profileImage?: string | null;
  message?: string;
  isUserBirthdayToday?: boolean;
}

const BirthdayLetterCard = ({
  username,
  profileImage,
  message,
  isUserBirthdayToday = false,
}: BirthdayLetterCardProps) => {
  return (
    <Container>
      <ProfileWrapper>
        <ProfileImageWithFallback
          uri={profileImage}
          size={40}
          isUserBirthdayToday={isUserBirthdayToday}
        />
        <UserName>{username}</UserName>
      </ProfileWrapper>
      <Message>{message || ''}</Message>
    </Container>
  );
};

export default BirthdayLetterCard;

const Container = styled.View`
  background-color: ${colors.white};
  border-radius: ${radius.lg}px;
  padding: ${16 * height}px ${16 * width}px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: ${12 * height}px;
`;

const ProfileWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${12 * height}px;
`;

const UserName = styled.Text`
  margin-top: ${8 * height}px;
  font-family: ${fonts.Regular};
  font-size: ${fontSize.lg}px;
  color: ${colors.text[1]};
`;

const Message = styled.Text`
  font-family: ${fonts.Regular};
  font-size: ${fontSize.lg}px;
  color: ${colors.text[1]};
`;
