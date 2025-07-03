import axios from 'axios';
import api from '@/api/api';

export interface UpdateProfilePayload {
  kakaoTalkId?: string;
  introduction?: string;
  profileImage?: string;
  mbti?: string;
}

// api 인스턴스 import

export interface UpdateProfilePayload {
  kakaoTalkId?: string;
  introduction?: string;
  profileImage?: string;
  mbti?: string;
}

export const updateUserProfile = async (payload: UpdateProfilePayload) => {
  console.log('보낼 데이터:', payload);

  try {
    const response = await api.patch('/users/me/profile', payload);
    console.log('응답 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('updateUserProfile 오류:', error.message);
    if (axios.isAxiosError(error)) {
      console.log('응답 상태:', error.response?.status);
      console.log('응답 데이터:', error.response?.data);
    }
    throw error;
  }
};
