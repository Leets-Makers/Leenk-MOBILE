import React, { useState } from 'react';
import { ImageBackground, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import styled from 'styled-components/native';
import { radius, SCREEN_HEIGHT, SCREEN_WIDTH } from '@/theme/globalStyles';
import { width as WIDTH, height as HEIGHT } from '@/theme/globalStyles';
import { Media } from '@/types/feed';
import GradientOverlay from '@/components/feed/GradientOverlay';

interface BackgroundImageSliderProps {
  mediaUrls: Media[];
  gradient?: {
    top?: number; // px (예: 120 * HEIGHT)
    bottom?: number; // px (예: 520 * HEIGHT)
    showTop?: boolean; // 기본 true
    showBottom?: boolean; // 기본 true
  };
}

const DEFAULT_TOP = 120 * HEIGHT;
const DEFAULT_BOTTOM = 520 * HEIGHT;

export default function BackgroundImageSlider({
  mediaUrls,
  gradient,
}: BackgroundImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const topHeight = gradient?.top ?? DEFAULT_TOP;
  const bottomHeight = gradient?.bottom ?? DEFAULT_BOTTOM;
  const showTop = gradient?.showTop ?? true;
  const showBottom = gradient?.showBottom ?? true;

  if (mediaUrls.length === 0) return null;

  const isSingle = mediaUrls.length === 1;

  return (
    <Wrapper>
      <CarouselWrapper>
        <Carousel
          loop={mediaUrls.length > 1}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          data={mediaUrls}
          onSnapToItem={setCurrentIndex}
          renderItem={({ item }) => (
            <StyledBackground
              source={{ uri: item.mediaUrl }}
              resizeMode="cover"
            >
              {showTop && (
                <GradientOverlay
                  type="top"
                  heightValue={topHeight}
                  pointerEvents="none"
                />
              )}
              {showBottom && (
                <GradientOverlay
                  type="bottom"
                  heightValue={bottomHeight}
                  pointerEvents="none"
                />
              )}
            </StyledBackground>
          )}
          autoPlay={false}
          scrollAnimationDuration={500}
          pagingEnabled={mediaUrls.length > 1}
        />
      </CarouselWrapper>

      {isSingle && (
        <TouchBlocker
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
        />
      )}

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
  pointer-events: box-none;
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
`;

const TouchBlocker = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
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
