import { create } from 'zustand';

interface ImageStore {
  selectedImages: string[];
  setSelectedImages: (images: string[]) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  selectedImages: [],
  setSelectedImages: (images) => {
    console.log('[🔁 setSelectedImages 호출됨]', images);
    set({ selectedImages: images });
  },
}));
