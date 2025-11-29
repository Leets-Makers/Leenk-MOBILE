export interface Author {
  userId: number;
  thumbnail: string;
  name: string;
  isUserBirthdayToday: boolean;
}

export interface Leenk {
  leenkId: number;
  author: Author;
  title: string;
  currentParticipants: number;
  maxParticipants: number;
  startTime: string;
  createdAt: string;
  updatedAt: string;
  thumbNail: string;
}

export interface LeenkListResponse {
  leenks: Leenk[];
}

export interface LeenkDetail {
  id: number;
  status: LeenkStatus;
  author: Author;
  kakaoId: string;
  title: string;
  placeName: string;
  currentParticipants: number;
  maxParticipants: number;
  startTime: string;
  content: string;
  mediaUrl: string;
  createdAt: string;
  updatedAt: string;
  isParticipated: boolean;
}

export interface LeenkParticipantItem {
  participant: Author;
  kakaoTalkId: string;
  currentParticipants: number;
  maxParticipants: number;
  joinedAt: string;
  isHost: boolean;
}

export interface LeenkParticipantsData {
  participants: LeenkParticipantItem[];
}

export interface UpdateLeenkPayload {
  title?: string;
  content?: string;
  placeName?: string;
  startTime?: string;
  maxParticipants?: number;
  mediaUrl?: string;
}

export type LeenkStatus = 'RECRUITING' | 'CLOSED' | 'FINISHED';
