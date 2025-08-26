import api from '@/api/api';
import { ApiResponse } from '@/api/api-type';
import { UpdateLeenkPayload } from '@/types/leenk';

// 링크 게시물 작성
export const createLeenk = async (payload: UpdateLeenkPayload) => {
  const res = await api.post<ApiResponse<string>>(`/leenks`, payload);

  if (__DEV__) {
    console.log(`링크 게시물 생성 payload:`, payload);
    console.log(`링크 게시물 생성 response:`, res.data);
  }
  return res.data.data;
};

// 링크 신고하기
export const reportLeenk = async (leenkId: number, report: string) => {
  const res = await api.post<ApiResponse<string>>(
    `/leenks/${leenkId}/reports`,
    {
      report,
    },
  );

  if (__DEV__) {
    console.log(`링크 신고(${leenkId}):`, res.data.data);
  }

  return res.data.data;
};

// 링크 참여하기
export const participantLeenk = async (leenkId: number) => {
  const res = await api.post<ApiResponse<string>>(
    `/leenks/${leenkId}/participant`,
  );

  if (__DEV__) {
    console.log(`링크 참여(${leenkId}):`, res.data.data);
  }

  return res.data.data;
};

// 링크 모임 종료(링크 종료)
export const finishLeenk = async (leenkId: number) => {
  const res = await api.post<ApiResponse<string>>(`/leenks/${leenkId}/finish`);

  if (__DEV__) {
    console.log(`링크 모임 종료(${leenkId}):`, res.data.data);
  }

  return res.data.data;
};

// 링크 모집 종료
export const closeLeenk = async (leenkId: number) => {
  const res = await api.post<ApiResponse<string>>(`/leenks/${leenkId}/close`);

  if (__DEV__) {
    console.log(`링크 모집 종료(${leenkId}):`, res.data.data);
  }

  return res.data.data;
};
