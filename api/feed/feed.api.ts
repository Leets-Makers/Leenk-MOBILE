import api from '@/api/api';
import { Author, FeedItem, FeedReactedUser } from '@/types/feed';
import { FeedDetail, UploadFeedPayload } from '@/types/feed';
import { ApiResponse } from '@/api/api-type';
import { Pageable } from '@/types/pageable';

export interface FeedListData {
  feeds: FeedItem[];
  pageable: Pageable;
}

export interface MyFeedListData {
  totalReactionCount: number;
  feeds: FeedItem[];
  pageable: Pageable;
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
  // if (__DEV__) console.log('피드 전체 조회 : ', res.data.data);
  return res.data.data;
};

// 피드 상세 조회
export const getFeedDetail = async (feedId: number) => {
  const res = await api.get<ApiResponse<FeedDetail>>(`/feeds/${feedId}`);
  if (__DEV__) console.log('피드 상세 조회 함께한 유저 : ', res.data.data);
  return res.data.data;
};

// 함께하는 사람 추가를 위한 사용자 전체 조회
export const getAllUsers = async () => {
  const res = await api.get<ApiResponse<Author[]>>('/feeds/users/all');
  if (__DEV__) console.log('함께하는 사람 목록 조회 : ', res.data);
  return res.data.data;
};

// 피드 공감한 유저 목록 조회
export const getFeedReactions = async (feedId: number) => {
  const res = await api.get<ApiResponse<FeedReactedUser[]>>(
    `/feeds/${feedId}/reactions`,
  );
  if (__DEV__) console.log('공감한 유저 목록 조회: ', res.data);
  return res.data.data;
};

// 다른 유저가 작성한 피드 목록 조회
export const getOtherUserFeedList = async (
  userId: number,
  pageNumber: number,
  pageSize: number,
) => {
  const res = await api.get<ApiResponse<FeedListData>>(
    `/feeds/users/${userId}`,
    {
      params: {
        pageNumber,
        pageSize,
      },
    },
  );
  if (__DEV__)
    console.log(`유저 ${userId}가 작성한 피드 목록 조회 : `, res.data);
  return res.data.data;
};

// 다른 유저가 함께한 피드 목록 조회
export const getOtherUserLinkedFeedList = async (
  userId: number,
  pageNumber: number,
  pageSize: number,
) => {
  const res = await api.get<ApiResponse<FeedListData>>(
    `/feeds/users/${userId}/linked`,
    {
      params: {
        pageNumber,
        pageSize,
      },
    },
  );
  if (__DEV__)
    console.log(`유저 ${userId}가 함께한 피드 목록 조회 : `, res.data);
  return res.data.data;
};

// POST
// 피드 업로드
export const uploadFeed = async (payload: UploadFeedPayload) => {
  const res = await api.post<ApiResponse<FeedDetail>>('/feeds', payload);
  return res.data.data;
};

// 피드 공감하기
export const uploadFeedReactions = async (
  feedId: number,
  reactionCount: number,
) => {
  const res = await api.post<ApiResponse<string>>(
    `/feeds/${feedId}/reactions`,
    { reactionCount },
  );
  if (__DEV__) console.log('피드 공감하기 : ', res.data);
  return res.data.data;
};

// 피드 신고하기
export const reportFeed = async (feedId: number, report: string) => {
  const res = await api.post<ApiResponse<string>>(`/feeds/${feedId}/reports`, {
    report,
  });
  if (__DEV__) console.log('피드 신고하기 : ', res.data);
  return res.data.data;
};

// DELETE
// 피드 삭제
export const deleteFeed = async (feedId: number) => {
  const res = await api.delete<ApiResponse<string>>(`/feeds/${feedId}`);
  if (__DEV__) console.log('피드 삭제 조회 : ', res.data);
  return res.data.data;
};

// ----------------------------------
// 마이페이지
// 내가 작성한 피드 목록 조회
export const getMyFeedList = async (pageNumber: number, pageSize: number) => {
  const res = await api.get<ApiResponse<MyFeedListData>>('/feeds/me', {
    params: { pageNumber, pageSize },
  });
  if (__DEV__) console.log('내가 작성한 피드 목록 조회 : ', res.data);
  return res.data.data;
};

// 내가 함께한 피드 목록 조회
export const getMyLinkedFeedList = async (
  pageNumber: number,
  pageSize: number,
) => {
  const res = await api.get<ApiResponse<FeedListData>>('/feeds/me/linked', {
    params: { pageNumber, pageSize },
  });
  if (__DEV__) console.log('내가 함께한 피드 목록 조회 : ', res.data);
  return res.data.data;
};
