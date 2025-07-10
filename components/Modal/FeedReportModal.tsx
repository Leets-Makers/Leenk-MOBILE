import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';
import { height, width, fontSize, radius, fonts } from '@/theme/globalStyles';
import CustomButton from '@/components/common/Button/CustomButton';
import { BottomSheetModal } from '@/components'; // 바텀시트 모달 import
import Textarea from '../common/Textarea';
import colors from '@/theme/color';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function FeedReportModal({ isOpen, onClose, onSubmit }: Props) {
  const [reason, setReason] = useState('');

  return (
    <BottomSheetModal visible={isOpen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={10}
      >
        <Content>
          <Title>해당 피드를 신고하는 이유를 알려줘</Title>
          <SubText>빠르게 확인하고 조치를 취해줄게!</SubText>
          <Textarea
            placeholder="텍스트를 입력해주세요"
            value={reason}
            onChangeText={setReason}
            maxLength={100}
            minHeight={30}
          />

          <ButtonWrapper>
            <CustomButton
              variant="primary"
              onPress={() => {
                onSubmit(reason);
                setReason('');
              }}
              disabled={reason.length === 0}
            >
              신고할게
            </CustomButton>
            <CustomButton variant="text" onPress={onClose}>
              취소
            </CustomButton>
          </ButtonWrapper>
        </Content>
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
}

const Content = styled.View`
  /* background-color: ${colors.white}; */
  padding: ${20 * height}px;
  border-radius: ${radius.lg}px;
  /* width: ${width * 30}px; */
`;

const Title = styled.Text`
  font-family: ${fonts.ExtraBold};
  font-size: ${fontSize.lg}px;
  margin-bottom: ${8 * height}px;
`;

const SubText = styled.Text`
  font-family: ${fonts.Regular};
  font-size: ${fontSize.md}px;
  color: ${colors.text[2]};
  margin-bottom: ${16 * height}px;
`;

const ButtonWrapper = styled.View`
  margin-top: ${20 * height}px;
`;
