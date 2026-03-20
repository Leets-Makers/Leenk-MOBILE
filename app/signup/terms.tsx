import { CheckBox, CustomButton, Header } from '@/components';
import ProfileTitleText from '@/components/signup/ProfileTitleText';
import { StyledSubText } from '@/app/signup/profile';
import BottomSheetModal from '@/components/Modal/BottomSheetModal';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { RightArrowIcon } from '@/assets';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { infoTerm, serviceTerm } from '@/constants/termsText';
import LinearGradient from 'react-native-linear-gradient';
import { updateUserAgreement } from '@/api/users/patchUserEachInfo.api';
import { useToastStore } from '@/stores/toastStore';

export default function TermsPage() {
  const [allCheck, setAllCheck] = useState(false);
  const [serviceCheck, setServiceCheck] = useState(false);
  const [infoCheck, setInfoCheck] = useState(false);
  const [visibleModal, setVisibleModal] = useState<'service' | 'info' | null>(
    null,
  );

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToastStore();

  const toggleAllCheck = () => {
    const next = !allCheck;
    setAllCheck(next);
    setServiceCheck(next);
    setInfoCheck(next);
  };

  const toggleServiceCheck = () => {
    const next = !serviceCheck;
    setServiceCheck(next);
    setAllCheck(next && infoCheck);
  };

  const toggleInfoCheck = () => {
    const next = !infoCheck;
    setInfoCheck(next);
    setAllCheck(serviceCheck && next);
  };

  const handleNext = async () => {
    try {
      await updateUserAgreement({
        termsService: serviceCheck,
        privacyPolicy: infoCheck,
      });

      router.replace('/signup/profile');
    } catch (error) {
      showToast('약관 동의에 실패했어.', 'error');
    }
  };

  useEffect(() => {
    setAllCheck(serviceCheck && infoCheck);
  }, [serviceCheck, infoCheck]);

  return (
    <Container>
      <Header />
      <ProfileTitleText>
        어서와 Leenk는 처음이지?{'\n'}즐기기 전에 약속 하나만 하자
      </ProfileTitleText>
      <StyledSubText>
        모든 항목에 동의하면 링크를 신나게 이용할 수 있어.
      </StyledSubText>

      <AllAgreeButton onPress={toggleAllCheck}>
        <CheckBox checked={allCheck} onPress={toggleAllCheck} />
        <ButtonText>모두 동의할게</ButtonText>
      </AllAgreeButton>

      <CheckItem onPress={() => setVisibleModal('service')}>
        <CheckLeft>
          <CheckBox checked={serviceCheck} onPress={toggleServiceCheck} noBox />
          <CheckText>서비스 이용약관 (필수)</CheckText>
        </CheckLeft>
        <RightArrowIcon />
      </CheckItem>

      <CheckItem onPress={() => setVisibleModal('info')}>
        <CheckLeft>
          <CheckBox checked={infoCheck} onPress={toggleInfoCheck} noBox />
          <CheckText>개인정보 수집/이용 동의 (필수)</CheckText>
        </CheckLeft>
        <RightArrowIcon />
      </CheckItem>

      <BottomButtonContainer $paddingBottom={insets.bottom}>
        <CustomButton
          variant="primary"
          onPress={handleNext}
          fullWidth
          rounded="md"
          size="lg"
          style={{ marginBottom: 10 * height }}
          disabled={!serviceCheck || !infoCheck}
        >
          다음으로
        </CustomButton>
      </BottomButtonContainer>

      <BottomSheetModal
        visible={visibleModal !== null}
        dismissOnBackdropPress={true}
      >
        <ModalContainer>
          <TermsTitle>
            {visibleModal === 'service'
              ? '서비스 이용약관 (필수)'
              : '개인정보 수집/이용 동의 (필수)'}
          </TermsTitle>
          <TermsContent>
            <TermsText>
              {visibleModal === 'service' ? serviceTerm : infoTerm}
            </TermsText>
          </TermsContent>

          <GradientOverlay colors={['rgba(255,255,255,0)', colors.white]} />

          <CustomButton
            variant="primary"
            onPress={() => {
              if (visibleModal === 'service') setServiceCheck(true);
              if (visibleModal === 'info') setInfoCheck(true);
              setVisibleModal(null);
            }}
            fullWidth
            rounded="md"
            size="lg"
            style={{ marginBottom: 10 * height }}
          >
            동의할게
          </CustomButton>
        </ModalContainer>
      </BottomSheetModal>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  padding-horizontal: ${20 * width}px;
`;

const AllAgreeButton = styled.Pressable`
  width: 100%;
  background-color: ${colors.bg[3]};
  border-radius: ${radius.md}px;
  padding: ${8 * height}px ${12 * width}px;
  flex-direction: row;
  align-items: center;
  gap: ${10 * width}px;
  margin: ${28 * height}px 0px ${8 * height}px 0px;
`;

const ButtonText = styled.Text`
  color: ${colors.text[1]};
  font-size: ${fontSize.md};
  font-family: ${fonts.Bold};
  line-height: ${lineHeight.m};
`;

const CheckItem = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${12 * height}px;
  padding-horizontal: ${20 * width}px;
`;

const CheckLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CheckText = styled.Text`
  font-size: ${fontSize.md};
  color: ${colors.text[1]};
  margin-left: ${8 * width}px;
`;

const BottomButtonContainer = styled.View<{ $paddingBottom: number }>`
  margin-top: auto;
  padding-bottom: ${(props) => props.$paddingBottom}px;
`;

const ModalContainer = styled.View`
  flex: 1;
  position: relative;
  max-height: ${525 * height}px;
`;

const TermsTitle = styled.Text`
  font-size: ${fontSize.lg};
  font-family: ${fonts.ExtraBold};
  color: ${colors.text[1]};
  line-height: ${lineHeight.l};
  margin-bottom: ${4 * height};
`;
const TermsContent = styled.ScrollView.attrs(() => ({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {},
}))``;

const TermsText = styled.Text`
  font-size: ${fontSize.md};
  color: ${colors.text[2]};
  line-height: ${lineHeight.m};
  font-family: ${fonts.Regular};
`;

const GradientOverlay = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${60 * height}px;
  height: ${80 * height}px;
  z-index: 1;
  pointer-events: none;
`;
