import { create } from 'zustand';
import { FeedConnectedUser } from '@/types/feed';

interface FeedWriteStore {
  selectedImages: string[];
  users: FeedConnectedUser[];
  description: string;

  setSelectedImages: (images: string[]) => void;
  addSelectedImage: (uri: string) => void;
  removeSelectedImage: (uri: string) => void;

  setUsers: (users: FeedConnectedUser[]) => void;
  addUser: (user: FeedConnectedUser) => void;
  removeUser: (userId: number) => void;

  setDescription: (text: string) => void;

  reset: () => void;
}

export const useFeedWriteStore = create<FeedWriteStore>((set) => ({
  selectedImages: [],
  users: [],
  description: '',

  setSelectedImages: (images) => set({ selectedImages: images }),
  addSelectedImage: (uri) =>
    set((state) => ({
      selectedImages: [...state.selectedImages, uri],
    })),
  removeSelectedImage: (uri) =>
    set((state) => ({
      selectedImages: state.selectedImages.filter((item) => item !== uri),
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

  setDescription: (text) => set({ description: text }),

  reset: () => set({ selectedImages: [], users: [], description: '' }),
}));
