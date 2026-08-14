import { configureStore } from "@reduxjs/toolkit";
import uploadReducer from "./upload/uploadSlice";
import searchReducer from "./search/searchSlice";
import downloadReducer from "./download/downloadSlice";
import statsReducer from "./stats/statsSlice"
import startupReducer from "./appSlice/startupSlice"

export const store = configureStore({
    reducer: {
        upload: uploadReducer,
        search: searchReducer,
        download: downloadReducer,
        stats: statsReducer,
        status: startupReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;