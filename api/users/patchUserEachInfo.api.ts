import api from '@/api/api';

// 카톡 ID 수정
export const updateKakaoTalkId = async ({
  kakaoTalkId,
}: {
  kakaoTalkId: string;
}) => {
  try {
    const response = await api.patch('/users/me/kakao-talk-id', {
      kakaoTalkId,
    });
    console.log('updateKakaoTalkId: ', response.data);
  } catch (error: any) {
    console.error('updateKakaoTalkId 오류:', error.message);
    throw error;
  }
};

// MBTI 수정
export const updateMbti = async ({ mbti }: { mbti: string }) => {
  try {
    const response = await api.patch('/users/me/mbti', { mbti });
    console.log('updateMbti: ', response.data);
  } catch (error: any) {
    console.error('updateMbti 오류:', error.message);
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
    const response = await api.patch('/users/me/introduction', {
      introduction,
    });
    console.log('updateIntroduction: ', response.data);
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
    const response = await api.patch('/users/me/profile-image', {
      profileImage,
    });
    console.log('updateProfileImage: ', response.data);
  } catch (error: any) {
    console.error('updateProfileImage 오류:', error.message);
    throw error;
  }
  return;
};
