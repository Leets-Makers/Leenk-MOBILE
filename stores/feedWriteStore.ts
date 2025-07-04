import { create } from 'zustand';
import { FeedConnectedUser, Media } from '@/types/feed';

export interface SelectedImage {
  uri: string;
  filename: string;
}

interface FeedWriteStore {
  selectedImages: SelectedImage[];
  users: FeedConnectedUser[];
  mediaUrls: Media[];
  description: string;

  setSelectedImages: (images: SelectedImage[]) => void;
  addSelectedImage: (uri: SelectedImage) => void;
  removeSelectedImage: (uri: string) => void;

  setUsers: (users: FeedConnectedUser[]) => void;
  addUser: (user: FeedConnectedUser) => void;
  removeUser: (userId: number) => void;

  setMediaUrls: (urls: Media[]) => void;
  addMediaUrl: (media: Media) => void;
  removeMediaUrl: (mediaUrl: string) => void;

  setDescription: (text: string) => void;

  reset: () => void;
}

export const useFeedWriteStore = create<FeedWriteStore>((set) => ({
  selectedImages: [],
  users: [],
  mediaUrls: [],
  description: '',

  setSelectedImages: (images) => set({ selectedImages: images }),
  addSelectedImage: (uri) =>
    set((state) => ({
      selectedImages: [...state.selectedImages, uri],
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

  reset: () =>
    set({ selectedImages: [], users: [], mediaUrls: [], description: '' }),
}));
