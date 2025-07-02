import axios from 'axios';
import { getAccessToken } from '@/utils/tokenStorage';

export interface UpdateProfilePayload {
  kakaoTalkId?: string;
  introduction?: string;
  profileImage?: string;
  mbti?: string;
}

export const updateUserProfile = async (payload: UpdateProfilePayload) => {
  const token = await getAccessToken();
  const url = `${process.env.EXPO_PUBLIC_API_URL}/users/me/profile`;

  console.log('프로필 업데이트 URL:', url);
  console.log('보낼 데이터:', payload);
  console.log('보낼 토큰:', token);

  try {
    const response = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('응답 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ updateUserProfile 오류:', error.message);
    if (axios.isAxiosError(error)) {
      console.log('응답 상태:', error.response?.status);
      console.log('응답 데이터:', error.response?.data);
    }
    throw error;
  }
};
