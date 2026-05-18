import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        unreadCount: 0
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(n => !n.isRead).length;
        },
        markNotificationAsRead: (state, action) => {
            const id = action.payload;
            const notification = state.notifications.find(n => n._id === id);
            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount -= 1;
            }
        },
        markAllNotificationsAsRead: (state) => {
            state.notifications.forEach(n => {
                n.isRead = true;
            });
            state.unreadCount = 0;
        }
    }
});

export const { setNotifications, markNotificationAsRead, markAllNotificationsAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
