import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Notification = {
  id: string;
  title: string;
  body?: string;
  ts: number;
  read?: boolean;
};

interface NotificationState {
  list: Notification[];
}

const initialState: NotificationState = {
  list: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.list.unshift(action.payload);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const noti = state.list.find((n) => n.id === action.payload);
      if (noti) noti.read = true;
    },
    clearNotifications: (state) => {
      state.list = [];
    },
  },
});

export const { addNotification, markAsRead, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
