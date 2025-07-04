import { CheckBox, CustomButton, Header } from '@/components';
import ProfileTitleText from '@/components/signup/ProfileTitleText';
import { StyledSubText } from './profile';
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
import { useState } from 'react';
import styled from 'styled-components/native';
import { RightArrowIcon } from '@/assets';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { infoTerm, serviceTerm } from '@/constants/termsText';
import LinearGradient from 'react-native-linear-gradient';
import { he } from '@faker-js/faker';

export default function TermsPage() {
  const [allCheck, setAllCheck] = useState(false);
  const [serviceCheck, setServiceCheck] = useState(false);
  const [infoCheck, setInfoCheck] = useState(false);
  const [visibleModal, setVisibleModal] = useState<'service' | 'info' | null>(
    null,
  );

  const router = useRouter();
  const insets = useSafeAreaInsets();

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

  const handleNext = () => {
    router.push('/signup/verify');
  };

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
        <CheckBox checked={allCheck} />
        <ButtonText>모두 동의할게</ButtonText>
      </AllAgreeButton>

      <CheckItem onPress={() => setVisibleModal('service')}>
        <CheckLeft>
          <CheckBox checked={serviceCheck} noBox />
          <CheckText>서비스 이용약관 (필수)</CheckText>
        </CheckLeft>
        <RightArrowIcon />
      </CheckItem>

      <CheckItem onPress={() => setVisibleModal('info')}>
        <CheckLeft>
          <CheckBox checked={infoCheck} noBox />
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

      <BottomSheetModal visible={visibleModal !== null}>
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

          {/* <GradientOverlay colors={['rgba(255,255,255,0)', colors.white]} /> */}

          <CustomButton
            variant="primary"
            onPress={() => {
              if (visibleModal === 'service') toggleServiceCheck();
              if (visibleModal === 'info') toggleInfoCheck();
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
  gap: ${4 * width}px;
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
  margin-top: ${20 * height}px;
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
  padding: 0 ${20 * width}px;
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
`;
const TermsContent = styled.ScrollView``;

const TermsText = styled.Text`
  font-size: ${fontSize.md};
  color: ${colors.text[2]};
  line-height: ${lineHeight.m};
  font-family: ${fonts.Regular};
`;

// const GradientOverlay = styled(LinearGradient)`
//   position: absolute;
//   bottom: ${80 * height}px;
//   left: 0;
//   right: 0;
//   height: ${80 * height}px;
//   z-index: 1;
// `;
