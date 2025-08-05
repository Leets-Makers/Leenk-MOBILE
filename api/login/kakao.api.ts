import api from '@/api/api';
import axios from 'axios';

export type KakaoLoginResult =
  | { success: true; data: any; code: number; message: string }
  | { success: false; code: number; message: string };

// Access Token 유효성 검증 (카카오 공식 API)
const validateKakaoToken = async (accessToken: string) => {
  try {
    const res = await axios.get(
      'https://kapi.kakao.com/v1/user/access_token_info',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log('[2] 카카오 토큰 유효성 OK:', res.data);
  } catch (e: any) {
    console.error('[2] 카카오 토큰 유효성 실패:', e.response?.data || e);
  }
};

export const kakaoLogin = async (
  accessToken: string,
): Promise<KakaoLoginResult> => {
  // [1] 토큰 로그 + 타입 확인
  console.log('[1] 카카오 accessToken:', accessToken);
  console.log('[1] accessToken 타입:', typeof accessToken);

  if (typeof accessToken !== 'string') {
    console.error('[1] ❗ accessToken이 문자열이 아님');
    return {
      success: false,
      code: -1,
      message: 'accessToken이 문자열이 아닙니다.',
    };
  }

  // [2] 토큰 유효성 검사
  await validateKakaoToken(accessToken);

  try {
    // [3] 백엔드 전송 로그
    console.log('[3] 백엔드에 보낼 accessToken:', accessToken);

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

    // [4] 응답 로그
    console.log('[4] 백엔드 응답 성공:', response.data);

    return {
      success: true,
      code,
      message,
      data,
    };
  } catch (error: any) {
    if (error.response?.data) {
      console.error(
        '[4] 백엔드 응답 실패:',
        JSON.stringify(error.response.data),
      );
      const { code, message } = error.response.data;
      return {
        success: false,
        code,
        message,
      };
    }

    console.error('[4] 백엔드 예외:', error);

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
