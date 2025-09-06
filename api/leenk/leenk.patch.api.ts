import api from '@/api/api';
import { ApiResponse } from '@/api/api-type';
import { UpdateLeenkPayload } from '@/types/leenk';

export const updateLeenk = async (
  leenkId: number,
  payload: UpdateLeenkPayload,
) => {
  const res = await api.patch<ApiResponse<string>>(
    `/leenks/${leenkId}`,
    payload,
  );

  return res.data.data;
};
