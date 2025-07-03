import { create } from 'zustand';

interface ImageStore {
  selectedImages: string[];
  setSelectedImages: (images: string[]) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  selectedImages: [],
  setSelectedImages: (images) => {
    set({ selectedImages: images });
  },
}));
