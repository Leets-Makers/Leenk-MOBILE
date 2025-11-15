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
import { reportLeenk } from '@/api/leenk/leenk.post.api';
import { postBirthdayLetter } from '@/api/private/birthday/postBirthdayLetters.api';

interface TextInputModalProps {
  type: 'feed' | 'leenk' | 'birthday';
  feedId?: number;
  leenkId?: number;
}

export default function TextInputModal({
  type = 'feed',
  feedId,
  leenkId,
}: TextInputModalProps) {
  const [text, setText] = useState('');
  const { modalType, receiverId, closeModal, openModal } = useModalStore();
  const { showToast } = useToastStore();

  const isOpen =
    (type === 'feed' && modalType === 'feedReport') ||
    (type === 'leenk' && modalType === 'leenkReport') ||
    (type === 'birthday' && modalType === 'birthdayLetter');

  const targetId = type === 'feed' ? feedId : leenkId;

  const modalConfig = {
    feed: {
      title: '해당 피드를 신고하는 이유를 알려줘',
      subtitle: '빠르게 확인하고 조치를 취해줄게!',
      buttonText: '신고할게',
      onSubmit: async () => {
        if (!targetId) throw new Error('feedId 없음');
        await reportFeed(targetId, text);
        showToast('해당 피드를 신고했어', 'success');
      },
    },
    leenk: {
      title: '해당 링크를 신고하는 이유를 알려줘',
      subtitle: '빠르게 확인하고 조치를 취해줄게!',
      buttonText: '신고할게',
      onSubmit: async () => {
        if (!targetId) throw new Error('leenkId 없음');
        await reportLeenk(targetId, text);
        showToast('해당 링크를 신고했어', 'success');
      },
    },
    birthday: {
      title: '생일 편지를 보내봐!',
      subtitle: '생일을 축하하는 메시지를 입력해 줘',
      buttonText: '생일 축하해!',
      onSubmit: async () => {
        if (!receiverId) throw new Error('receiverId 없음');
        await postBirthdayLetter(receiverId, { message: text });
      },
    },
  } as const;

  const { title, subtitle, buttonText, onSubmit } = modalConfig[type];

  const handleSubmit = async () => {
    try {
      await onSubmit();
      if (type === 'birthday') {
        closeModal();
        setText('');

        requestAnimationFrame(() => {
          openModal('birthdayLetterFinish');
        });

        return;
      }

      closeModal();
      setText('');
    } catch (error) {
      const errorMessage = type === 'birthday' ? '전송 실패!' : '신고 실패!';
      console.error(`${type} 처리 실패:`, error);
      showToast(errorMessage, 'error');

      closeModal();
      setText('');
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
                <Title>{title}</Title>
                <SubText>{subtitle}</SubText>

                <Textarea
                  placeholder="텍스트를 입력해 주세요"
                  value={text}
                  onChangeText={setText}
                  maxLength={type === 'birthday' ? 40 : 100}
                  minHeight={30}
                  maxHeight={40}
                />

                <ButtonWrapper>
                  <CustomButton
                    variant="primary"
                    size="lg"
                    onPress={handleSubmit}
                    disabled={text.length === 0}
                  >
                    {buttonText}
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
