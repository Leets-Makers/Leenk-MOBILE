import { onboardingData } from '@/constants/onBoardingData';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { Image } from 'expo-image';
import React, { useRef } from 'react';
import { FlatList, Animated } from 'react-native';
import styled from 'styled-components/native';
import { ExpandingDot } from 'react-native-animated-pagination-dots';

export default function OnBoarding() {
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
        keyExtractor={(_, index) => index.toString()}
        horizontal
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
      />

      <ExpandingDot
        data={onboardingData}
        scrollX={scrollX}
        expandingDotWidth={40}
        inActiveDotOpacity={0.3}
        dotStyle={{
          width: 6,
          height: 6,
          borderRadius: 3,
          marginHorizontal: 6,
          backgroundColor: colors.primary,
        }}
        containerStyle={{
          alignSelf: 'center',
          position: 'absolute',
          bottom: 32,
        }}
        inActiveDotColor={colors.primary}
        activeDotColor="#F45916"
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const SlideContainer = styled.View`
  width: ${100 * width}%;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

const TitleText = styled.Text`
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l}px;
  font-family: ${fonts.Bold};
  color: ${colors.black};
  text-align: center;
`;

const SubText = styled.Text`
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
  font-family: ${fonts.Regular};
  color: ${colors.text[2]};
  margin-top: ${12 * height}px;
  text-align: center;
`;

const SlideImage = styled(Image)`
  width: 100%;
  height: 300px;
  margin-top: ${24 * height}px;
`;
