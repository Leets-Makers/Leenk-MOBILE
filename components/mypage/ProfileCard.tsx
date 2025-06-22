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
  display: flex;
  background-color: ${colors.white};
  width: ${336 * width}px;
  height: ${347 * height}px;
  border-radius: ${radius.md}px;
  padding: ${24 * height}px ${16 * width}px ${16 * height}px${16 * width}px;
`;

const RowContainer = styled.View`
  position: relative;
  flex-direction: row;
  justify-content: space-between;
`;

const LeftSection = styled.View`
  justify-content: center;
`;

const TextWrapper = styled.View`
  position: relative;
  flex-direction: row;
`;

const MbtiText = styled.Text`
  font-size: ${fontSize.md}px;
  font-weight: 700;
  color: ${colors.primary};
  line-height: ${lineHeight.m}px;
  margin-top: ${4 * height}px;
  font-family: ${fonts.Regular};
`;

const Badge = styled.Text`
  background-color: ${colors.primaryLight};
  color: ${colors.white};
  font-size: ${fontSize.sm}px;
  padding: ${4 * height}px ${8 * width}px;
  border-radius: ${radius.md}px;
  align-self: flex-start;
`;

const NameText = styled.Text`
  font-size: ${fontSize.lg}px;
  font-weight: 700;
  color: ${colors.text[1]};
  line-height: ${lineHeight.l}px;
  font-family: ${fonts.Regular};
`;
