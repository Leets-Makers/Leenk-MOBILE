import { create } from 'zustand';
import { Notification } from '@/types/notification';

interface NotificationState {
  notifications: Notification[];
  page: number;
  hasNext: boolean;
  setNotifications: (
    notifications: Notification[],
    hasNext: boolean,
    page: number,
  ) => void;
  appendNotifications: (
    notifications: Notification[],
    hasNext: boolean,
    page: number,
  ) => void;
  resetNotifications: () => void;
}

export const notificationStore = create<NotificationState>((set) => ({
  notifications: [],
  page: 0,
  hasNext: true,

  setNotifications: (notifications, hasNext, page) =>
    set({ notifications, hasNext, page }),

  appendNotifications: (newNotifications, hasNext, page) =>
    set((state) => ({
      notifications: [...state.notifications, ...newNotifications],
      hasNext,
      page,
    })),

  resetNotifications: () => set({ notifications: [], page: 0, hasNext: true }),
}));
