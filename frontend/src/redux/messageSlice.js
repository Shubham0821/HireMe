import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        unreadCount: 0,
        contacts: []
    },
    reducers: {
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
        setContacts: (state, action) => {
            state.contacts = action.payload;
        }
    }
});

export const { setUnreadCount, setContacts } = messageSlice.actions;
export default messageSlice.reducer;
