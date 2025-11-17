import ProfileImageWithFallback from '../feed/ProfileImageWithFallback';
import CustomButton from '../common/Button/CustomButton';
import { fonts, fontSize, height, radius, width } from '@/theme/globalStyles';
import colors from '@/theme/color';
import styled from 'styled-components/native';

interface BirthdayCardProps {
  username: string;
  profileImage?: string | null;
  onPress: () => void;
  isUserBirthdayToday: boolean;
  myBirthdayLettersCounts?: number;
  hasNewLetters?: boolean;
  isOwnBirthdayToday?: boolean; // 로그인한 사용자 생일 판별
}

export default function BirthdayCard({
  username,
  profileImage,
  onPress,
  isUserBirthdayToday,
  myBirthdayLettersCounts = 0,
  hasNewLetters = false,
  isOwnBirthdayToday,
}: BirthdayCardProps) {
  return (
    <Container>
      <LeftSection>
        <ProfileImageWithFallback
          uri={profileImage}
          size={79}
          isUserBirthdayToday={isUserBirthdayToday}
        />

        <ContentArea>
          <NameText>{username}</NameText>
        </ContentArea>
      </LeftSection>

      {/*  본인 생일이면 표시 */}
      {isOwnBirthdayToday && (
        <BadgeWrapper>
          <LettersButton onPress={onPress}>
            <LettersText>받은 편지</LettersText>
            <BadgeWrapperInButton>
              <Badge>{myBirthdayLettersCounts}</Badge>
            </BadgeWrapperInButton>
            {hasNewLetters && <Dot />}
          </LettersButton>
        </BadgeWrapper>
      )}

      {/* 본인 생일이 아닐 때만 표시 */}
      {!isOwnBirthdayToday && (
        <CustomButton
          onPress={onPress}
          variant="secondary"
          size="sm"
          rounded="lg"
          textStyle={{ transform: [{ translateY: -1 }] }}
        >
          축하해주기
        </CustomButton>
      )}
    </Container>
  );
}

const Container = styled.View`
  background-color: ${colors.white};
  width: 100%;
  border-radius: ${radius.lg}px;
  padding: ${24 * height}px ${16 * width}px ${16 * height}px ${16 * width}px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const ContentArea = styled.View`
  flex: 1;
  margin-left: ${10 * width}px;
`;

const NameText = styled.Text`
  color: ${colors.text[1]};
  font-family: ${fonts.Bold};
  font-size: ${fontSize.lg}px;
  padding-bottom: ${4 * height}px;
`;

const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const LettersButton = styled.TouchableOpacity`
  background-color: ${colors.primary};
  padding: ${6 * height}px ${8 * width}px ${6 * height}px ${12 * width}px;
  border-radius: ${radius.lg}px;
  flex-direction: row;
  align-items: center;
`;

const LettersText = styled.Text`
  color: ${colors.white};
  font-family: ${fonts.Bold};
  font-size: ${fontSize.sm}px;
  margin-right: ${8 * width}px;
`;

const Badge = styled.Text`
  color: ${colors.primary};
  font-family: ${fonts.Bold};
  font-size: ${fontSize.sm}px;
`;

const BadgeWrapper = styled.View`
  position: relative;
`;

const BadgeWrapperInButton = styled.View`
  background-color: ${colors.white};
  padding: ${4 * height}px ${6 * width}px;
  border-radius: ${radius.lg}px;
`;

const Dot = styled.View`
  width: 5px;
  height: 5px;
  border-radius: ${radius.lg}px;
  background-color: ${colors.secondary};
  position: absolute;
  top: 8px;
  right: 9px;
`;
