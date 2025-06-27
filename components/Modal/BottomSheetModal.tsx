import React, { useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';
import CustomButton from '@/components/common/Button/CustomButton';
import { height, radius, SCREEN_WIDTH, width } from '@/theme/globalStyles';
import { onboardingData } from '@/constants/onBoardingData';
import colors from '@/theme/color';

const CommonBottomSheet = React.forwardRef<
  BottomSheetModal,
  { isOnboarding?: boolean; onConfirm?: () => void }
>(({ isOnboarding = false, onConfirm }, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={[isOnboarding ? '75%' : '50%']}
      backgroundStyle={{
        borderRadius: 24,
        backgroundColor: '#fff',
      }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
    >
      <Container>
        {isOnboarding ? (
          <>
            <FlatList
              data={onboardingData}
              keyExtractor={(_, i) => String(i)}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged.current}
              renderItem={({ item }) => (
                <Slide>
                  <Title>{item.title}</Title>
                  <SubText>{item.subText}</SubText>
                  <SlideImage source={item.image} resizeMode="contain" />
                </Slide>
              )}
            />
            <IndicatorContainer>
              {onboardingData.map((_, index) => (
                <Dot key={index} isActive={index === currentIndex} />
              ))}
            </IndicatorContainer>
            <CustomButton
              fullWidth
              size="lg"
              onPress={() => {
                ref && typeof ref !== 'function' && ref.current?.dismiss();
                onConfirm?.();
              }}
              style={{ marginTop: 24 * height }}
            >
              확인했어
            </CustomButton>
          </>
        ) : (
          <>
            <CustomButton
              fullWidth
              size="lg"
              onPress={() => console.log('후기')}
              style={{ marginTop: 40 * height }}
            >
              후기 쓰러갈래
            </CustomButton>
            <CustomButton
              variant="text"
              textColor="text[2]"
              fullWidth
              size="lg"
              onPress={() => console.log('나중에할래')}
              style={{ marginTop: 8 * height }}
            >
              나중에 할래
            </CustomButton>
          </>
        )}
      </Container>
    </BottomSheetModal>
  );
});

export default CommonBottomSheet;

const Container = styled.View`
  padding: 24px 16px;
  align-items: center;
`;

const Slide = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: ${24 * height}px;
  flex: 1;
`;

const SlideImage = styled.Image`
  width: 100%;
  height: 360px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const SubText = styled.Text`
  font-size: 14px;
  color: ${colors.text[2]};
  margin-bottom: 20px;
`;

const IndicatorContainer = styled.View`
  margin-top: ${16 * height}px;
  align-self: center;
  flex-direction: row;
  gap: 8px;
  z-index: 100;
`;

const Dot = styled.View<{ isActive: boolean }>`
  width: ${8 * width}px;
  height: ${8 * height}px;
  border-radius: ${radius.full}px;
  background-color: ${({ isActive }) =>
    isActive ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'};
`;
