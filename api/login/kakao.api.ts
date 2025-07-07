import api from '@/api/api';
import axios from 'axios';

export type KakaoLoginResult =
  | { success: true; data: any; code: number; message: string }
  | { success: false; code: number; message: string };

export const kakaoLogin = async (
  accessToken: string,
): Promise<KakaoLoginResult> => {
  try {
    const response = await api.post(
      '/kakao/login',
      {},
      {
        headers: {
          'Kakao-Access-Token': accessToken,
        },
      },
    );

    const { code, message, data } = response.data;

    return {
      success: true,
      code,
      message,
      data,
    };
  } catch (error: any) {
    if (error.response?.data) {
      console.error('카카오 로그인 실패:', JSON.stringify(error.response.data));
      const { code, message } = error.response.data;
      return {
        success: false,
        code,
        message,
      };
    }

    console.error('카카오 로그인 예외:', error);

    return {
      success: false,
      code: 0,
      message: '알 수 없는 오류가 발생했어요',
    };
  }
};

export interface KakaoUserInfo {
  id: number;
  kakao_account: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
      thumbnail_image_url?: string;
    };
    [key: string]: any;
  };
}

export const getKakaoUserInfo = async (
  accessToken: string,
): Promise<KakaoUserInfo> => {
  try {
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('카카오 유저 정보 조회 실패:', error.response?.data || error);
    throw error;
  }
};
