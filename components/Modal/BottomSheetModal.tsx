// components/CommonBottomSheet.tsx

import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';
import CustomButton from '../common/Button/CustomButton';
import { height } from '@/theme/globalStyles';

interface CommonBottomSheetProps {
  isOnboarding?: boolean;
  title: string;
  subText: string;
  onWriteReview?: () => void;
  onLater?: () => void;
  onConfirm?: () => void;
}

const CommonBottomSheet = React.forwardRef<
  BottomSheetModal,
  CommonBottomSheetProps
>(
  (
    { isOnboarding = false, title, subText, onWriteReview, onLater, onConfirm },
    ref,
  ) => {
    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={['50%']}
        backgroundStyle={{ borderRadius: 24 }}
      >
        <Container>
          <Title>{title}</Title>
          <SubText>{subText}</SubText>

          <ImageBox isOnboarding={isOnboarding} />

          {isOnboarding ? (
            <>
              <DotIndicator />
              <CustomButton
                fullWidth
                size="lg"
                onPress={() => console.log('확인')}
                style={{ marginTop: 40 * height }}
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
  },
);

export default CommonBottomSheet;

const Container = styled.View`
  padding: 24px 16px;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const SubText = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const ImageBox = styled.View<{ isOnboarding: boolean }>`
  width: ${({ isOnboarding }) => (isOnboarding ? '100%' : '180px')};
  height: ${({ isOnboarding }) => (isOnboarding ? '200px' : '180px')};
  background-color: #eee;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const DotIndicator = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 4px;
  margin-bottom: 20px;
`;

// 간단한 dot 구성 예시
const Dot = styled.View<{ active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? '#6a0dad' : '#ddd')};
`;

const LaterText = styled.Text`
  margin-top: 12px;
  color: #666;
  text-decoration: underline;
`;
