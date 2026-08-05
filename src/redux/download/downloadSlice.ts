import { createSlice } from "@reduxjs/toolkit";
import downloadFileThunk from "./downloadThunk";

interface downloadState {
    loading: boolean,
    success: boolean,
    error: string | null
}

const initialState: downloadState = {
    loading: false,
    success: false,
    error: null,
}

const downloadSlice = createSlice({
    name: "download",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

        .addCase(downloadFileThunk.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(downloadFileThunk.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
            state.error = null;
        })
        .addCase(downloadFileThunk.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload as string
        })
    }
})

export default downloadSlice.reducer;