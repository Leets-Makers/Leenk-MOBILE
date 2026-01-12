import api from '@/api/api';

export const appleLogin = async (idToken: string) => {
  try {
    const response = await api.post(
      '/apple/login',
      {},
      {
        headers: {
          'Apple-Identity-Token': idToken,
        },
      },
    );

    const { code, message, data } = response.data;
    return { code, message, data };
  } catch (error: any) {
    console.log('APPLE LOGIN ERROR', error);
    console.log('message', error?.message);
    console.log('response', error?.response);
    console.log('response data', error?.response?.data);

    if (error.response?.data) {
      const { code, message } = error.response.data;
      return { code, message };
    }

    return {
      code: 0,
      message: '알 수 없는 오류가 발생했어요',
    };
  }
};
