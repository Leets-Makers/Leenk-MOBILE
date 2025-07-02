import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export type KakaoLoginResult =
  | { success: true; data: any; code: string; message: string }
  | { success: false; code: string; message: string };

export const kakaoLogin = async (
  accessToken: string,
): Promise<KakaoLoginResult> => {
  try {
    const response = await axios.post(
      `${BASE_URL}kakao/login`,
      {},
      {
        headers: {
          'Kakao-Access-Token': accessToken,
        },
      },
    );

    const { code, message, ...data } = response.data;

    return {
      success: true,
      code,
      message,
      data,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const { code, message } = error.response.data;
      return {
        success: false,
        code,
        message,
      };
    }

    return {
      success: false,
      code: 'UNKNOWN',
      message: '알 수 없는 오류가 발생했어요',
    };
  }
};
