import React from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import LockIcon from '@/assets/images/ic_lock.svg';
import {
  fontSize,
  lineHeight,
  radius,
  fonts,
  width,
  height,
} from '@/theme/globalStyles';
import { Header } from '@/components';
import { Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SettingIcon } from '@/assets';

export default function MyPage() {
  const router = useRouter();

  return (
    <Container>
      <Header
        TitleSection={
          <Text
            style={{
              fontWeight: 700,
              fontSize: fontSize.lg,
              fontFamily: fonts.Regular,
              lineHeight: lineHeight.l,
            }}
          >
            마이 페이지
          </Text>
        }
        RightSection={
          <TouchableOpacity onPress={() => router.push('/')}>
            <SettingIcon />
          </TouchableOpacity>
        }
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.bg[2]};
  gap: 20px;
`;
