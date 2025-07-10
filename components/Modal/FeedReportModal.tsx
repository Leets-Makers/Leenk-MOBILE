import { useState } from 'react';
import {
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import styled from 'styled-components/native';
import { height, width, fontSize, radius, fonts } from '@/theme/globalStyles';
import colors from '@/theme/color';
import CustomButton from '@/components/common/Button/CustomButton';
import { Textarea } from '@/components';
import { useModalStore } from '@/stores/modalStore';
import { useToastStore } from '@/stores/toastStore';
import { reportFeed } from '@/api/feed/feed.api';

interface FeedReportModalProps {
  feedId: number;
}

export default function FeedReportModal({ feedId }: FeedReportModalProps) {
  const [report, setreport] = useState('');
  const { modalType, closeModal } = useModalStore();
  const { showToast } = useToastStore();

  const isOpen = modalType === 'feedReport';

  const handleSubmit = async () => {
    try {
      await reportFeed(feedId, report);
      showToast('해당 피드를 신고했어!', 'success');
    } catch (error) {
      console.error('피드 신고 실패:', error);
      showToast('신고 실패!', 'error');
    } finally {
      closeModal();
      setreport('');
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Backdrop>
          <Pressable style={{ flex: 1 }} onPress={closeModal} />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? -20 * height : 0}
            style={{ flex: 1, justifyContent: 'flex-end' }}
          >
            <SheetContainer>
              <SheetBox>
                <Title>해당 피드를 신고하는 이유를 알려줘</Title>
                <SubText>빠르게 확인하고 조치를 취해줄게!</SubText>

                <Textarea
                  placeholder="텍스트를 입력해 주세요"
                  value={report}
                  onChangeText={setreport}
                  maxLength={100}
                  minHeight={30}
                />

                <ButtonWrapper>
                  <CustomButton
                    variant="primary"
                    size="lg"
                    onPress={handleSubmit}
                    disabled={report.length === 0}
                  >
                    신고할게
                  </CustomButton>
                  <CancelButton onPress={closeModal}>
                    <CancelText>취소</CancelText>
                  </CancelButton>
                </ButtonWrapper>
              </SheetBox>
            </SheetContainer>
          </KeyboardAvoidingView>
        </Backdrop>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const Backdrop = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.3);
`;

const SheetContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  padding: ${20 * height}px ${16 * width}px ${30 * height}px;
`;

const SheetBox = styled.View`
  height: ${320 * height}px;
  background-color: ${colors.white};
  border-radius: ${radius.lg}px;
  padding: ${24 * height}px ${20 * width}px;
`;

const Title = styled.Text`
  font-size: ${fontSize.xl}px;
  font-family: ${fonts.ExtraBold};
  color: ${colors.text[1]};
  margin-bottom: ${12 * height}px;
`;

const SubText = styled.Text`
  font-size: ${fontSize.md}px;
  font-family: ${fonts.Regular};
  color: ${colors.text[2]};
  margin-bottom: ${16 * height}px;
`;

const ButtonWrapper = styled.View`
  margin-top: ${40 * height}px;
`;

const CancelButton = styled.TouchableOpacity`
  margin-top: ${16 * height}px;
  align-items: center;
`;

const CancelText = styled.Text`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.md}px;
  color: ${colors.gray[700]};
`;
