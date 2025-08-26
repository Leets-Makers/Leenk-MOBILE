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

  if (__DEV__) {
    console.log(`링크 수정(${leenkId}) payload:`, payload);
    console.log(`링크 수정(${leenkId}) response:`, res.data);
  }
  return res.data.data;
};
