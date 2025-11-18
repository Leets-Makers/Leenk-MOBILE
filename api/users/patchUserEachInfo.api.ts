import api from '@/api/api';

// 약관 동의
export const updateUserAgreement = async ({
  termsService,
  privacyPolicy,
}: {
  termsService: boolean;
  privacyPolicy: boolean;
}) => {
  try {
    await api.patch('/users/agreement', {
      termsService,
      privacyPolicy,
    });
  } catch (error: any) {
    console.error('updateUserAgreement 오류:', error.message);
    throw error;
  }
};

// 카톡 ID 수정
export const updateKakaoTalkId = async ({
  kakaoTalkId,
}: {
  kakaoTalkId: string;
}) => {
  try {
    await api.patch('/users/me/kakao-talk-id', {
      kakaoTalkId,
    });
  } catch (error: any) {
    console.error('updateKakaoTalkId 오류:', error.message);
    throw error;
  }
};

// MBTI 수정
export const updateMbti = async ({ mbti }: { mbti: string }) => {
  try {
    await api.patch('/users/me/mbti', { mbti });
  } catch (error: any) {
    console.error('updateMbti 오류:', error.message);
    throw error;
  }
};

// 생일 수정
export const updateBirthday = async ({ birthday }: { birthday: string }) => {
  try {
    await api.patch('/users/me/birthday', { birthday });
  } catch (error: any) {
    console.error('updateBirthday 오류:', error.message);
    throw error;
  }
};

// 자기소개 수정
export const updateIntroduction = async ({
  introduction,
}: {
  introduction: string;
}) => {
  try {
    await api.patch('/users/me/introduction', {
      introduction,
    });
  } catch (error: any) {
    console.error('updateIntroduction 오류:', error.message);
    throw error;
  }
};

// 프로필 이미지 수정
export const updateProfileImage = async ({
  profileImage,
}: {
  profileImage: string;
}) => {
  try {
    await api.patch('/users/me/profile-image', {
      profileImage,
    });
  } catch (error: any) {
    console.error('updateProfileImage 오류:', error.message);
    throw error;
  }
  return;
};