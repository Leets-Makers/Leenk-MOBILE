import axios from 'axios';
import api from '@/api/api';

export interface UpdateProfilePayload {
  kakaoTalkId?: string;
  introduction?: string;
  profileImage?: string;
  mbti?: string;
}

export const updateUserProfile = async (payload: UpdateProfilePayload) => {
  try {
    const response = await api.patch('/users/me/profile', payload);

    return response.data;
  } catch (error: any) {
    console.error('updateUserProfile 오류:', error.message);
    if (axios.isAxiosError(error)) {
      console.log('updateUserProfile 응답 상태:', error.response?.status);
      console.log('updateUserProfile 응답 데이터:', error.response?.data);
    }
    throw error;
  }
};
