import {
  LeenkDetail,
  LeenkListResponse,
  LeenkParticipantsData,
} from '@/types/leenk';
import api from '@/api/api';
import { ApiResponse } from '@/api/api-type';

export const getLeenkList = async (
  pageNumber: number,
  pageSize: number,
  status: 'ALL' | 'OPEN' | 'CLOSED' = 'ALL',
) => {
  const res = await api.get<ApiResponse<LeenkListResponse>>('/leenks', {
    params: {
      status,
      pageNumber,
      pageSize,
    },
  });

  if (__DEV__) {
    console.log('링크 전체 조회:', res.data);
    console.log('first leenk:', res.data.data.leenks[0]);
  }

  return res.data;
};

// 링크 상세 조회
export const getLeenkDetail = async (leenkId: number) => {
  const res = await api.get<ApiResponse<LeenkDetail>>(`/leenks/${leenkId}`);

  if (__DEV__) {
    console.log(`링크 상세 조회(${leenkId}):`, res.data.data);
  }

  return res.data.data;
};

// 링크 참여자 목록 조회
export const getLeenkParticipants = async (leenkId: number) => {
  const res = await api.get<ApiResponse<LeenkParticipantsData>>(
    `/leenks/${leenkId}/participants`,
  );
  if (__DEV__)
    console.log(`참여자 목록(${leenkId}):`, res.data.data.participants);
  return res.data.data.participants;
};
