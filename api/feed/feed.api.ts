import api from '@/api/api';
import { Author, FeedItem, FeedReactedUser } from '@/types/feed';
import { FeedDetail } from '@/types/feed';
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
  console.log('[API 호출] getFeedList 실행');
  const res = await api.get<ApiResponse<FeedListData>>('/feeds', {
    params: {
      pageNumber,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_TOKEN}`,
    },
  });
  return res.data.data.feeds;
};

// 피드 상세 조회
export const getFeedDetail = async (feedId: number) => {
  const res = await api.get<ApiResponse<FeedDetail>>(`/feeds/${feedId}`);
  return res.data.data;
};

// 함께하는 사람 추가를 위한 사용자 전체 조회
export const getAllUsers = async () => {
  const res = await api.get<ApiResponse<Author[]>>('/feeds/user/all');
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

// 피드 공감하기

// DELETE
// 피드 삭제
