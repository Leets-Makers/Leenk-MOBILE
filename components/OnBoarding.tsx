import { onboardingData } from '@/constants/onBoardingData';
import colors from '@/theme/color';
import { fonts, fontSize, height, lineHeight } from '@/theme/globalStyles';
import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import styled from 'styled-components/native';

export default function OnBoarding() {
  return (
    <View style={{ flex: 1 }}>
      <PagerView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        initialPage={0}
      >
        {onboardingData.map(item)}
        <View key="1">
          {' '}
          <Title>{item.title}</Title>
          <SubText>{item.subText}</SubText>
          <Image source={item.image} resizeMode="contain" />
        </View>

        <View key="2">// page component</View>

        <View key="3">// page component</View>
      </PagerView>
    </View>
  );
}

const TitleText = styled.Text`
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l}px;
  font-family: ${fonts.Bold};
  color: ${colors.black};
`;

const SubText = styled.Text`
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
  font-family: ${fonts.Regular};
  color: ${colors.text[2]};
  margin-top: ${12 * height}px;
`;
