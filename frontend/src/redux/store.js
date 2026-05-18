import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import notificationSlice from "./notificationSlice";
import messageSlice from "./messageSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        job: jobSlice,
        notification: notificationSlice,
        message: messageSlice
    }
});

export default store;
