import { onboardingData } from '@/constants/onBoardingData';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  SCREEN_WIDTH,
  width,
} from '@/theme/globalStyles';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import styled from 'styled-components/native';
import { CustomButton } from '@/components';

export default function OnBoarding({ onClose }: { onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <Container>
      <Carousel
        loop={false}
        width={SCREEN_WIDTH - 48 * width}
        height={520 * height}
        data={onboardingData}
        onSnapToItem={setCurrentIndex}
        renderItem={({ item }) => (
          <SlideContainer>
            <TitleText>{item.title}</TitleText>
            <SubText>{item.subText}</SubText>
            <ImageWrapper>
              <SlideImage source={item.image} contentFit="contain" />
            </ImageWrapper>
          </SlideContainer>
        )}
        scrollAnimationDuration={400}
      />

      <IndicatorContainer>
        {onboardingData.map((_, index) => (
          <Dot key={index} isActive={index === currentIndex} />
        ))}
      </IndicatorContainer>

      <CustomButton fullWidth size="lg" onPress={onClose}>
        확인했어
      </CustomButton>
    </Container>
  );
}

const Container = styled.View`
  background-color: ${colors.white};
  border-radius: ${radius.lg}px;
  padding: ${32 * height}px ${18 * width}px ${32 * height}px;
  justify-content: center;
  align-items: center;
`;

const SlideContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const TitleText = styled.Text`
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l}px;
  font-family: ${fonts.Bold};
  color: ${colors.black};
  align-self: flex-start;
  text-align: left;
  width: 100%;
`;

export const SubText = styled.Text`
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
  font-family: ${fonts.Regular};
  color: ${colors.text[2]};
  margin-top: ${4 * height}px;
  align-self: flex-start;
  text-align: left;
  width: 100%;
`;

const ImageWrapper = styled.View`
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: ${radius.sm}px;
  overflow: hidden;
  align-self: center;
  margin-top: ${16 * height}px;
  margin-bottom: ${32 * height}px;
`;

const SlideImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const IndicatorContainer = styled.View`
  flex-direction: row;
  align-self: center;
  margin-bottom: ${32 * height}px;
  gap: ${8 * width}px;
`;

const Dot = styled.View<{ isActive: boolean }>`
  width: ${8 * width}px;
  height: ${8 * height}px;
  margin-top: ${-10 * height}px;
  border-radius: ${radius.full}px;
  background-color: ${({ isActive }) =>
    isActive ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.2)'};
`;
