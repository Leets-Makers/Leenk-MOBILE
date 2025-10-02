import api from '../api';
import { ApiResponse } from '../api-type';
export type LoginSuccessData = {
  accessToken: string;
  refreshToken: string;
  name: string;
  position: string;
  cardinal: number;
};
export const postLogin = async (email: string, password: string) => {
  const res = await api.post<ApiResponse<LoginSuccessData>>(`/login`, {
    email,
    password,
  });

  return res.data;
};
