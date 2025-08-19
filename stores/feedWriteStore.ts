import { create } from 'zustand';
import { FeedConnectedUser, FeedDetail, Media } from '@/types/feed';

export interface SelectedImage {
  uri: string;
  filename: string;
}

export type EditImage =
  | { type: 'create'; uri: string; filename: string; tempId: string } // 피드 글쓰기용 로컬
  | { type: 'edit'; id: number; uri: string }; // 수정용

interface FeedWriteStore {
  selectedImages: SelectedImage[];
  users: FeedConnectedUser[];
  mediaUrls: Media[];
  description: string;

  isEdit: boolean; // 수정 모드 여부
  feedId?: number;

  setSelectedImages: (images: SelectedImage[]) => void;
  addSelectedImage: (image: SelectedImage) => void;
  removeSelectedImage: (uri: string) => void;

  setUsers: (users: FeedConnectedUser[]) => void;
  addUser: (user: FeedConnectedUser) => void;
  removeUser: (userId: number) => void;

  setMediaUrls: (urls: Media[]) => void;
  addMediaUrl: (media: Media) => void;
  removeMediaUrl: (mediaUrl: string) => void;

  setDescription: (text: string) => void;

  startCreate: () => void;
  startEditFromDetail: (d: FeedDetail) => void;
  buildUpdatePayload: (
    uploadLocal: (file: {
      uri: string;
      filename: string;
    }) => Promise<{ fileId: number }>,
  ) => Promise<{
    content: string;
    connectedUserIds: number[];
    images: { id?: number; fileId?: number; order: number }[];
  }>;

  reset: () => void;
}

export const useFeedWriteStore = create<FeedWriteStore>((set, get) => ({
  selectedImages: [],
  users: [],
  mediaUrls: [],
  description: '',

  isEdit: false,
  feedId: undefined,

  setSelectedImages: (images) => set({ selectedImages: images }),
  addSelectedImage: (image) =>
    set((state) => ({
      selectedImages: [...state.selectedImages, image],
    })),
  removeSelectedImage: (uri) =>
    set((state) => ({
      selectedImages: state.selectedImages.filter((item) => item.uri !== uri),
    })),

  setUsers: (users) => set({ users }),
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),
  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user.userId !== userId),
    })),

  setMediaUrls: (urls) => set({ mediaUrls: urls }),
  addMediaUrl: (media) =>
    set((state) => ({
      mediaUrls: [...state.mediaUrls, media],
    })),
  removeMediaUrl: (mediaUrl) =>
    set((state) => ({
      mediaUrls: state.mediaUrls.filter((item) => item.mediaUrl !== mediaUrl),
    })),

  setDescription: (text) => set({ description: text }),

  /** 새 글쓰기 진입 */
  startCreate: () =>
    set({
      isEdit: false,
      feedId: undefined,
      users: [],
      description: '',
    }),

  /** 수정 진입: 상세 응답으로 프리필 */
  startEditFromDetail: (d) =>
    set({
      isEdit: true,
      feedId: d.feedId,
      // 서버 이미지들을 mediaUrls로만 세팅 (기존 변수명 유지)
      mediaUrls: d.media.map((m, idx) => ({
        mediaUrl: m.mediaUrl,
        position: m.position ?? idx,
        mediaType: m.mediaType,
      })),
      users: d.linkedUser,
      description: d.description ?? '',
      // 로컬 선택은 비움(사용자가 추가하면 selectedImages에 쌓임)
      selectedImages: [],
    }),

  /** 저장(PATCH) 바디 생성: mediaUrls는 id로, selectedImages는 업로드 후 fileId로 */
  buildUpdatePayload: async (uploadLocal) => {
    const { mediaUrls, selectedImages, users, description } = get();

    // 1) 로컬 이미지 업로드
    const uploaded = await Promise.all(
      selectedImages.map(async (img) => {
        const { fileId } = await uploadLocal({
          uri: img.uri,
          filename: img.filename,
        });
        return { fileId };
      }),
    );

    // 2) 전송 순서 결정: mediaUrls(기존) → selectedImages(신규)
    const images = [
      ...mediaUrls.map((m, idx) => ({ id: m.position, order: idx })), // 기존
      ...uploaded.map((u, i) => ({
        fileId: u.fileId,
        order: mediaUrls.length + i,
      })), // 신규
    ];

    return {
      content: description,
      connectedUserIds: users.map((u) => u.userId),
      images,
    };
  },

  reset: () =>
    set({
      selectedImages: [],
      users: [],
      mediaUrls: [],
      description: '',
      isEdit: false,
      feedId: undefined,
    }),
}));
