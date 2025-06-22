import { Header, Input, Textarea } from '@/components';
import { mockUserData } from '@/constants/mockUserData';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { BackArrowIcon } from '@/assets';

export default function AccountEdit() {
  const { type } = useLocalSearchParams();
  const router = useRouter();

  const headerText =
    type === 'kakaoId'
      ? '카톡 ID'
      : type === 'mbti'
        ? 'MBTI'
        : type === 'intro'
          ? '자기소개'
          : '프로필 수정';

  return (
    <Container>
      <Header
        LeftSection={
          <TouchableOpacity onPress={() => router.back()}>
            <BackArrowIcon />
          </TouchableOpacity>
        }
        TitleSection={
          <Text
            style={{
              fontWeight: '700',
              fontSize: fontSize.lg,
              fontFamily: fonts.Regular,
              lineHeight: lineHeight.l,
            }}
          >
            {headerText}
          </Text>
        }
      />
      <MarginContainer>
        {type === 'kakaoId' && (
          <Input
            title="카카오톡 ID를 입력해줘"
            subMessage="모임원들과의 연락을 위해 필요해."
            placeholder={mockUserData.kakaoId}
          />
        )}

        {type === 'mbti' && (
          <Input title="MBTI를 입력해줘" placeholder={mockUserData.mbti} />
        )}

        {type === 'intro' && (
          <Textarea
            title="자기소개를 입력해줘"
            placeholder={mockUserData.intro}
          />
        )}
      </MarginContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  padding: ${28 * height}px ${20 * width}px;
`;

const MarginContainer = styled.View`
  margin-top: ${28 * height}px;
`;
