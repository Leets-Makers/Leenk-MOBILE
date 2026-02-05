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
import CustomButton from '@/components/common/Button/CustomButton';
import { useRouter } from 'expo-router';
import KakaoIdButton from '@/components/mypage/KakaoIdButton';
import ProfileImageWithFallback from '@/components/feed/ProfileImageWithFallback';
import { formatMonthDay } from '@/utils/format-date';

type ProfileCardProps = {
  cardinal?: number;
  name: string;
  imageUrl?: string;
  introduction?: string;
  kakaoTalkId?: string;
  mbti?: string;
  birthday?: string;
  isMyProfile?: boolean;
  isUserBirthdayToday?: boolean;
};

const INTRO_MAX_PX = 150 * height; // 원하는 최대 높이(px)
const INTRO_LINE_PX = lineHeight.m; // 한 줄 line-height(px)
const INTRO_MAX_LINES = Math.floor(INTRO_MAX_PX / INTRO_LINE_PX);

export default function ProfileCard({
  cardinal,
  name,
  imageUrl,
  introduction,
  kakaoTalkId,
  mbti,
  birthday,
  isMyProfile = false,
  isUserBirthdayToday = false,
}: ProfileCardProps) {
  const router = useRouter();
  return (
    <Container>
      <RowContainer>
        <TextWrapper>
          <LeftSection>
            <NameText>{name}</NameText>
            {cardinal && (
              <BadgeWrapper>
                <Badge>{cardinal}기</Badge>
              </BadgeWrapper>
            )}
          </LeftSection>

          <InfoSection>
            <InfoText textColor={colors.text[3]}>MBTI</InfoText>
            <InfoText textColor={colors.primary} isPrimary>
              {mbti || '미등록'}
            </InfoText>

            <InfoText textColor={colors.text[3]}>생일</InfoText>
            <InfoText textColor={colors.primary} isPrimary>
              {birthday ? formatMonthDay(birthday) : '미등록'}
            </InfoText>
          </InfoSection>
        </TextWrapper>
        <ProfileImageWithFallback
          uri={imageUrl}
          size={79}
          isUserBirthdayToday={isUserBirthdayToday}
        />
      </RowContainer>
      {introduction?.trim() && <IntroContainer>{introduction}</IntroContainer>}
      <KakaoIdButton kakaoTalkId={kakaoTalkId ? kakaoTalkId : '미등록'} />

      {isMyProfile && (
        <CustomButton
          variant="text"
          textColor="text[2]"
          size="sm"
          fullWidth
          onPress={() => router.push('/account' as const)}
          style={{
            marginTop: 12 * height,
          }}
        >
          프로필 수정하기
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
`;

const RowContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TextWrapper = styled.View`
  flex: 1;
  margin-right: ${12 * width}px;
`;

const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
`;

const NameText = styled.Text`
  font-size: ${fontSize['2xl']}px;
  color: ${colors.text[1]};
  font-family: ${fonts.Bold};
`;

const BadgeWrapper = styled.View`
  margin-left: ${8 * width}px;
  justify-content: center;
`;

const Badge = styled.Text`
  background-color: ${colors.primaryLight};
  color: ${colors.white};
  font-size: ${fontSize.sm}px;
  padding: ${4 * height}px ${12 * width}px;
  border-radius: ${radius.sm}px;
  font-family: ${fonts.Bold};
  line-height: ${lineHeight.s};
`;

const InfoText = styled.Text<{ textColor?: string; isPrimary?: boolean }>`
  font-size: ${fontSize.md}px;
  font-family: ${fonts.Bold};
  margin-top: ${8 * height}px;
  color: ${({ textColor }) => textColor || colors.text[1]};
  padding-right: ${({ isPrimary }) => (isPrimary ? `${12 * width}px` : '0')};
`;

const InfoSection = styled.View`
  flex-direction: row;
  gap: ${8 * width}px;
`;

const IntroContainer = styled.Text.attrs({
  numberOfLines: INTRO_MAX_LINES,
  ellipsizeMode: 'tail',
})`
  width: 100%;
  margin: ${20 * height}px 0 ${24 * height}px 0;
  font-size: ${fontSize.md}px;
  color: ${colors.text[2]};
  font-family: ${fonts.Bold};
  line-height: ${lineHeight.m}px;
  text-align: justify;
  max-height: ${INTRO_MAX_PX}px;
`;
