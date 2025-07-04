import api from '@/api/api';
import { Author, FeedItem, FeedReactedUser } from '@/types/feed';
import { FeedDetail, UploadFeedPayload } from '@/types/feed';
import { ApiResponse } from '@/api/api-type';

export interface FeedListData {
  feeds: FeedItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    numberOfElements: number;
    hasNext: boolean;
    empty: boolean;
  };
}

// GET
// 피드 전체 조회
export const getFeedList = async (pageNumber: number, pageSize: number) => {
  const res = await api.get<ApiResponse<FeedListData>>('/feeds', {
    params: {
      pageNumber,
      pageSize,
    },
  });
  return res.data;
};

// 피드 상세 조회
export const getFeedDetail = async (feedId: number) => {
  const res = await api.get<ApiResponse<FeedDetail>>(`/feeds/${feedId}`);
  return res.data.data;
};

// 함께하는 사람 추가를 위한 사용자 전체 조회
export const getAllUsers = async () => {
  const res = await api.get<ApiResponse<Author[]>>('/feeds/users/all');
  console.log('함께하는 사람 목록 조회 : ', res.data);
  return res.data.data;
};

// 피드 공감한 유저 목록 조회
export const getFeedReactions = async (feedId: number) => {
  const res = await api.get<ApiResponse<FeedReactedUser[]>>(
    `/feeds/${feedId}/reactions`,
  );
  return res.data.data;
};

// ----------------------------------
// 마이페이지

// POST
// 피드 업로드
export const uploadFeed = async (payload: UploadFeedPayload) => {
  const res = await api.post<ApiResponse<FeedDetail>>('/feeds', payload);
  return res.data.data;
};
// 피드 공감하기

// DELETE
// 피드 삭제
