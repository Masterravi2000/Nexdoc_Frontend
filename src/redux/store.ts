import { configureStore } from "@reduxjs/toolkit";
import uploadReducer from "./upload/uploadSlice";
import searchReducer from "./search/searchSlice";
import downloadReducer from "./download/downloadSlice";

export const store = configureStore({
    reducer: {
        upload: uploadReducer,
        search: searchReducer,
        download: downloadReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;