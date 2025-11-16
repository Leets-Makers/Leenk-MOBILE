import api from '@/api/api';

export const appleLogin = async (idToken: string) => {
  return api.post(
    '/apple/login',
    {},
    {
      headers: {
        'Apple-Identity-Token': idToken,
      },
    },
  );
};
