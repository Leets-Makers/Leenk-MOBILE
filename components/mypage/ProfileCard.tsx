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
import CustomButton from '../common/Button/CustomButton';
import { useRouter } from 'expo-router';
import KakaoIdButton from './KakaoIdButton';

type ProfileCardProps = {
  cardinal: number;
  name: string;
  imageUrl?: string;
  intro: string;
  kakaoId: string;
  mbti: string;
};

export default function ProfileCard({
  cardinal,
  name,
  imageUrl,
  intro,
  kakaoId,
  mbti,
}: ProfileCardProps) {
  const router = useRouter();
  return (
    <Container>
      <RowContainer>
        <TextWrapper>
          <LeftSection>
            <NameText>{name}</NameText>
            <Badge>{cardinal}기</Badge>
          </LeftSection>
          <MbtiText>{mbti}</MbtiText>
        </TextWrapper>
        <DefaultProfileImage width={79 * width} height={79 * height} />
      </RowContainer>
      <IntroContainer>{intro}</IntroContainer>
      <KakaoIdButton kakaoId={kakaoId} />
      <CustomButton
        variant="text"
        textColor="text[2]"
        size="sm"
        onPress={() => router.push('/')}
        style={{
          width: 304 * width,
          height: 32 * height,
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
  font-weight: 700;
  color: ${colors.text[1]};
  font-family: ${fonts.Bold};
`;

const Badge = styled.Text`
  background-color: ${colors.primaryLight};
  color: ${colors.white};
  font-size: ${fontSize.sm}px;
  padding: ${4 * height}px ${12 * width}px;
  border-radius: ${radius.sm}px;
  margin-left: ${8 * width}px;
`;

const MbtiText = styled.Text`
  font-size: ${fontSize.md}px;
  color: ${colors.primary};
  font-family: ${fonts.Regular};
  margin-top: ${8 * height}px;
  font-weight: 700;
`;

const IntroContainer = styled.Text`
  width: 100%;
  margin: ${20 * height}px 0 ${24 * height}px 0;
  font-size: ${fontSize.md}px;
  color: ${colors.text[2]};
  font-family: ${fonts.Regular};
  line-height: ${lineHeight.m}px;
  font-weight: 700;
  text-align: justify;
`;
