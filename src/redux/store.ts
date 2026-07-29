import { configureStore } from "@reduxjs/toolkit";
import uploadReducer from "./upload/uploadSlice"
import statusReducer from "./status/fetchUploadStatusSlice"

export const store = configureStore({
    reducer: {
        upload: uploadReducer,
        status: statusReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;