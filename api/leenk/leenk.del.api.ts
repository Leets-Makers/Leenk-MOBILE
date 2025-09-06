import api from '@/api/api';
import { ApiResponse } from '@/api/api-type';

// 링크 나가기
export const leaveLeenk = async (leenkId: number) => {
  const res = await api.delete<ApiResponse<string>>(
    `/leenks/${leenkId}/participant`,
  );

  return res.data.data;
};

// 링크 삭제하기
export const deleteLeenk = async (leenkId: number) => {
  const res = await api.delete<ApiResponse<string>>(`/leenks/${leenkId}`);

  return res.data.data;
};

// 링크 참여자 내보내기
export const kickLeenkParticipants = async (
  leenkId: number,
  participantId: number,
) => {
  const res = await api.delete<ApiResponse<string>>(
    `/leenks/${leenkId}/participants/${participantId}`,
  );

  return res.data.data;
};
