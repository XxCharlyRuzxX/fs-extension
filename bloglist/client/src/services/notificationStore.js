import { create } from "zustand";

let timeoutId;

const notificationStore = create((set) => ({
  notification: null,
  notify: ({ message, type }) => {
    clearTimeout(timeoutId);
    set({ notification: { message, type } });
    timeoutId = setTimeout(() => set({ notification: null }), 5000);
  },
  clearNotification: () => {
    clearTimeout(timeoutId);
    set({ notification: null });
  },
}));

export const useNotificationStore = () => notificationStore((state) => state);