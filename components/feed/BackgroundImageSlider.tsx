import React, { useState } from 'react';
import { ImageBackground } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import styled from 'styled-components/native';
import { radius, SCREEN_HEIGHT, SCREEN_WIDTH } from '@/theme/globalStyles';
import { width as WIDTH, height as HEIGHT } from '@/theme/globalStyles';
import { Media } from '@/types/feed';

interface BackgroundImageSliderProps {
  mediaUrls: Media[];
}

export default function BackgroundImageSlider({
  mediaUrls,
}: BackgroundImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (mediaUrls.length === 0) return null;

  return (
    <Wrapper>
      <CarouselWrapper>
        <Carousel
          loop={mediaUrls.length > 1}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          data={mediaUrls}
          onSnapToItem={(index) => setCurrentIndex(index)}
          renderItem={({ item }) => (
            <StyledBackground
              source={{ uri: item.mediaUrl }}
              resizeMode="cover"
            />
          )}
          autoPlay={false}
          scrollAnimationDuration={500}
          pagingEnabled={mediaUrls.length > 1}
        />
      </CarouselWrapper>

      {mediaUrls.length > 1 && (
        <IndicatorContainer>
          {mediaUrls.map((_, index) => (
            <Dot key={index} isActive={index === currentIndex} />
          ))}
        </IndicatorContainer>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex: 1;
  position: relative;
`;

const CarouselWrapper = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const StyledBackground = styled(ImageBackground)`
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const IndicatorContainer = styled.View`
  position: absolute;
  bottom: ${20 * HEIGHT}px;
  align-self: center;
  flex-direction: row;
  gap: 8px;
  z-index: 100;
`;

const Dot = styled.View<{ isActive: boolean }>`
  width: ${8 * WIDTH}px;
  height: ${8 * HEIGHT}px;
  border-radius: ${radius.full}px;
  background-color: ${({ isActive }) =>
    isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'};
`;
