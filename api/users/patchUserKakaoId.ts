import api from '@/api/api';

export const updateUserKakaoTalkId = async ({
  kakaoTalckId,
}: {
  kakaoTalckId: string;
}) => {
  try {
    const response = await api.patch('/users/me/kakao-talk-id', kakaoTalckId);
    console.log('updateUserKakaoTalkId: ', response.data);
  } catch (error: any) {
    console.error('updateUserKakaoTalkId 오류:', error.message);
    throw error;
  }
  return;
};
