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
import CustomButton from './common/Button/CustomButton';

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
        keyExtractor={(_, index) => index.toString()}
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
          width: 8,
          height: 8,
          borderRadius: 99,
          marginHorizontal: 8,
        }}
        containerStyle={{
          alignSelf: 'center',
          position: 'absolute',
          bottom: 104,
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
  flex: 1;
  background-color: ${colors.white};
`;

const SlideContainer = styled.View`
  justify-content: center;
  align-items: start;
`;

const TitleText = styled.Text`
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l}px;
  font-family: ${fonts.Bold};
  color: ${colors.black};
  text-align: start;
`;

const SubText = styled.Text`
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.m}px;
  font-family: ${fonts.Regular};
  color: ${colors.text[2]};
  margin-top: ${4 * height}px;
  text-align: start;
`;

const SlideImage = styled(Image)`
  width: ${324 * width}px;
  height: ${430 * height}px;
  margin: ${24 * height}px 0 ${64 * height}px 0;
`;
