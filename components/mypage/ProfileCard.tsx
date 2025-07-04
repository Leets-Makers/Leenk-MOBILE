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
import { DefaultProfileImage } from '@/assets';
import CustomButton from '@/components/common/Button/CustomButton';
import { useRouter } from 'expo-router';
import KakaoIdButton from '@/components/mypage/KakaoIdButton';

type ProfileCardProps = {
  cardinal: number;
  name: string;
  imageUrl?: string;
  introduction: string;
  kakaoTalkId: string;
  mbti: string;
};

export default function ProfileCard({
  cardinal,
  name,
  imageUrl,
  introduction,
  kakaoTalkId,
  mbti,
}: ProfileCardProps) {
  const router = useRouter();
  return (
    <Container>
      <RowContainer>
        <TextWrapper>
          <LeftSection>
            <NameText>{name}</NameText>
            <BadgeWrapper>
              <Badge>{cardinal}기</Badge>
            </BadgeWrapper>
          </LeftSection>
          <MbtiText>{mbti}</MbtiText>
        </TextWrapper>
        {imageUrl ? (
          <ProfileImage source={{ uri: imageUrl }} />
        ) : (
          <DefaultProfileImage width={79 * width} height={79 * height} />
        )}
      </RowContainer>
      <IntroContainer>{introduction}</IntroContainer>
      <KakaoIdButton kakaoTalkId={kakaoTalkId} />
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

const MbtiText = styled.Text`
  font-size: ${fontSize.md}px;
  color: ${colors.primary};
  font-family: ${fonts.Bold};
  margin-top: ${8 * height}px;
`;

const IntroContainer = styled.Text`
  width: 100%;
  margin: ${20 * height}px 0 ${24 * height}px 0;
  font-size: ${fontSize.md}px;
  color: ${colors.text[2]};
  font-family: ${fonts.Bold};
  line-height: ${lineHeight.m}px;
  text-align: justify;
`;

const ProfileImage = styled.Image`
  width: ${79 * width}px;
  height: ${79 * height}px;
  border-radius: 99px;
`;
