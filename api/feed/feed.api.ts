import api from '@/api/api';
import {
  Author,
  FeedItem,
  FeedNavigation,
  FeedReactedUser,
  Media,
} from '@/types/feed';
import { FeedDetail, UploadFeedPayload } from '@/types/feed';
import { ApiResponse } from '@/api/api-type';
import { Pageable } from '@/types/pageable';

const PATH = '/feeds';

export interface FeedListData {
  feeds: FeedItem[];
  pageable: Pageable;
}

export interface MyFeedListData {
  totalReactionCount: number;
  feeds: FeedItem[];
  pageable: Pageable;
}

export interface PatchFeedBody {
  description?: string;
  media?: Media[];
  userIds?: number[];
}

// GET
// 피드 전체 조회
export const getFeedList = async (pageNumber: number, pageSize: number) => {
  const res = await api.get<ApiResponse<FeedListData>>(PATH, {
    params: {
      pageNumber,
      pageSize,
    },
  });
  return res.data.data;
};

// 피드 상세 조회
export const getFeedDetail = async (feedId: number) => {
  const res = await api.get<ApiResponse<FeedDetail>>(`${PATH}/${feedId}`);
  return res.data.data;
};

// 피드 네비게이션 조회( 이전 피드, 다음 피드 조회 )
export const getFeedNavigation = async (
  feedId: number,
  prevSize: number = 1,
  nextSize: number = 1,
) => {
  const res = await api.get<ApiResponse<FeedNavigation>>(
    `${PATH}/${feedId}/navigation`,
    {
      params: {
        prevSize,
        nextSize,
      },
    },
  );
  return res.data.data;
};

// 함께하는 사람 추가를 위한 사용자 전체 조회
export const getAllUsers = async () => {
  const res = await api.get<ApiResponse<Author[]>>(`${PATH}/users/all`);
  return res.data.data;
};

// 피드 공감한 유저 목록 조회
export const getFeedReactions = async (feedId: number) => {
  const res = await api.get<ApiResponse<FeedReactedUser[]>>(
    `${PATH}/${feedId}/reactions`,
  );
  return res.data.data;
};

// 다른 유저가 작성한 피드 목록 조회
export const getOtherUserFeedList = async (
  userId: number,
  pageNumber: number,
  pageSize: number,
) => {
  const res = await api.get<ApiResponse<FeedListData>>(
    `${PATH}/users/${userId}`,
    {
      params: {
        pageNumber,
        pageSize,
      },
    },
  );
  if (__DEV__) return res.data.data;
};

// 다른 유저가 함께한 피드 목록 조회
export const getOtherUserLinkedFeedList = async (
  userId: number,
  pageNumber: number,
  pageSize: number,
) => {
  const res = await api.get<ApiResponse<FeedListData>>(
    `${PATH}/users/${userId}/linked`,
    {
      params: {
        pageNumber,
        pageSize,
      },
    },
  );
  return res.data.data;
};

// POST
// 피드 업로드
export const uploadFeed = async (payload: UploadFeedPayload) => {
  const res = await api.post<ApiResponse<FeedDetail>>(PATH, payload);
  return res.data.data;
};

// 피드 공감하기
export const uploadFeedReactions = async (
  feedId: number,
  reactionCount: number,
) => {
  const res = await api.post<ApiResponse<string>>(
    `${PATH}/${feedId}/reactions`,
    { reactionCount },
  );
  return res.data.data;
};

// 피드 신고하기
export const reportFeed = async (feedId: number, report: string) => {
  const res = await api.post<ApiResponse<string>>(`${PATH}/${feedId}/reports`, {
    report,
  });
  return res.data.data;
};

// DELETE
// 피드 삭제
export const deleteFeed = async (feedId: number) => {
  const res = await api.delete<ApiResponse<string>>(`${PATH}/${feedId}`);
  return res.data.data;
};

// PATCH
// 피드 수정
export const patchMyFeed = async (feedId: number, body: PatchFeedBody) => {
  // 빈 키 제거
  const payload = Object.fromEntries(
    Object.entries(body).filter(([, v]) => v !== undefined),
  ) as PatchFeedBody;

  const res = await api.patch<ApiResponse<string>>(`${PATH}/${feedId}`, payload);
  return res.data.data;
};

// ----------------------------------
// 마이페이지
// 내가 작성한 피드 목록 조회
export const getMyFeedList = async (pageNumber: number, pageSize: number) => {
  const res = await api.get<ApiResponse<MyFeedListData>>(`${PATH}/me`, {
    params: { pageNumber, pageSize },
  });
  return res.data.data;
};

// 내가 함께한 피드 목록 조회
export const getMyLinkedFeedList = async (
  pageNumber: number,
  pageSize: number,
) => {
  const res = await api.get<ApiResponse<FeedListData>>(`${PATH}/me/linked`, {
    params: { pageNumber, pageSize },
  });
  return res.data.data;
};
