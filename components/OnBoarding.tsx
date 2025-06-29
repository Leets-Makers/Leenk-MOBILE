import { onboardingData } from '@/constants/onBoardingData';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  SCREEN_WIDTH,
  width,
} from '@/theme/globalStyles';
import { Image } from 'expo-image';
import React, { useRef } from 'react';
import { FlatList, Animated } from 'react-native';
import styled from 'styled-components/native';
import { ExpandingDot } from 'react-native-animated-pagination-dots';
import CustomButton from '@/components/common/Button/CustomButton';

export default function OnBoarding({ onClose }: { onClose: () => void }) {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <Container>
      <FlatList
        data={onboardingData}
        renderItem={({ item }) => (
          <SlideContainer>
            <TitleText>{item.title}</TitleText>
            <SubText>{item.subText}</SubText>
            <SlideImage source={item.image} contentFit="contain" />
          </SlideContainer>
        )}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
      />
      <ExpandingDot
        data={onboardingData}
        scrollX={scrollX}
        expandingDotWidth={8}
        inActiveDotOpacity={1}
        dotStyle={{
          width: 8 * width,
          height: 8 * height,
          borderRadius: 99,
          marginHorizontal: 8 * width,
        }}
        containerStyle={{
          alignSelf: 'center',
          position: 'absolute',
          bottom: 90 * height,
        }}
        inActiveDotColor={'#0000004D'}
        activeDotColor={colors.black}
      />
      <CustomButton fullWidth size="lg" onPress={onClose}>
        확인했어
      </CustomButton>
    </Container>
  );
}

const Container = styled.View`
  background-color: ${colors.white};
`;

const SlideContainer = styled.View`
  justify-content: center;
  align-items: start;
`;

export const TitleText = styled.Text`
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l}px;
  font-family: ${fonts.Bold};
  color: ${colors.black};
  text-align: start;
`;

export const SubText = styled.Text`
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
  font-family: ${fonts.Regular};
  color: ${colors.text[2]};
  margin-top: ${4 * height}px;
  text-align: start;
`;

const SlideImage = styled(Image)`
  width: ${324 * (SCREEN_WIDTH / 375)}px;
  height: ${430 * height}px;
  margin: ${16 * height}px 0 ${64 * height}px 0;
`;
