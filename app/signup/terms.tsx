import { CheckBox, Header } from '@/components';
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
import { CheckIcon, RightArrowIcon } from '@/assets';

export default function TermsPage() {
  const [allCheck, setAllCheck] = useState(false);
  const [serviceCheck, setServiceCheck] = useState(false);
  const [infoCheck, setInfoCheck] = useState(false);
  const [visibleModal, setVisibleModal] = useState<'service' | 'info' | null>(
    null,
  );

  // 전체 동의 클릭 시 모두 체크
  const toggleAllCheck = () => {
    const next = !allCheck;
    setAllCheck(next);
    setServiceCheck(next);
    setInfoCheck(next);
  };

  // 개별 체크 박스 동작 시 전체 동의 체크 여부 변경
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
        <CheckBox checked={serviceCheck} noBox />
        <CheckText>서비스 이용약관 (필수)</CheckText>
        <RightArrowIcon />
      </CheckItem>

      <CheckItem onPress={() => setVisibleModal('info')}>
        <CheckBox checked={infoCheck} noBox />
        <CheckText>개인정보 수집/이용 동의 (필수)</CheckText>
        <RightArrowIcon />
      </CheckItem>

      {/* 다음으로 버튼 */}
      <NextButton disabled={!serviceCheck || !infoCheck}>
        <NextText>다음으로</NextText>
      </NextButton>

      {/* 바텀 시트 모달 */}
      <BottomSheetModal visible={visibleModal !== null}>
        <TermsContent>
          {visibleModal === 'service' ? (
            <TermsTitle>서비스 이용약관 (필수)</TermsTitle>
          ) : (
            <TermsTitle>개인정보 수집/이용 동의 (필수)</TermsTitle>
          )}
          <TermsText>
            여기에 상세 약관 내용을 적어주세요. 스크롤 가능해야 합니다.
          </TermsText>
          <AgreeButton
            onPress={() => {
              if (visibleModal === 'service') toggleServiceCheck();
              if (visibleModal === 'info') toggleInfoCheck();
              setVisibleModal(null);
            }}
          >
            <AgreeText>동의할게</AgreeText>
          </AgreeButton>
        </TermsContent>
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
  margin-top: ${20 * height}px;
`;

const CheckText = styled.Text`
  font-size: ${fontSize.md};
  color: ${colors.text[1]};
  margin-left: ${8 * width}px;
`;

const NextButton = styled.TouchableOpacity<{ disabled: boolean }>`
  width: 100%;
  background-color: ${({ disabled }) =>
    disabled ? colors.gray[300] : colors.primary};
  border-radius: ${radius.md}px;
  padding: ${12 * height}px 0;
  align-items: center;
  justify-content: center;
  margin-top: auto;
`;

const NextText = styled.Text`
  font-size: ${fontSize.md};
  font-family: ${fonts.Bold};
  color: ${colors.white};
`;

// 모달 내부
const TermsContent = styled.ScrollView.attrs(() => ({
  contentContainerStyle: { paddingBottom: 50 * height },
}))``;

const TermsTitle = styled.Text`
  font-size: ${fontSize.lg};
  font-family: ${fonts.Bold};
  color: ${colors.text[1]};
  margin-bottom: ${12 * height}px;
`;

const TermsText = styled.Text`
  font-size: ${fontSize.sm};
  color: ${colors.text[2]};
  line-height: ${lineHeight.m};
`;

const AgreeButton = styled.Pressable`
  margin-top: ${24 * height}px;
  padding: ${12 * height}px;
  background-color: ${colors.primary};
  border-radius: ${radius.md}px;
  align-items: center;
`;

const AgreeText = styled.Text`
  color: ${colors.white};
  font-size: ${fontSize.md};
  font-family: ${fonts.Bold};
`;
