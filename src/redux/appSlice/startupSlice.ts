import { createSlice } from "@reduxjs/toolkit";
import { backendStartupStatusThunk } from "./startupThunk";


interface appState {
    loading: boolean;
    success: boolean;
    error: string | null;
    backendReady: boolean;
    startupCompleted: boolean;
}

const initialState: appState = {
    loading: false,
    success: false,
    error: null,
    backendReady: false,
    startupCompleted: false
}

const startupSlice = createSlice ({
    name: "startupSlice",
    initialState,
    reducers: {
        setStartupCompleted: (state) => {
            state.startupCompleted = true;
        }
    },
    extraReducers: (builder) => {
        builder

        .addCase(backendStartupStatusThunk.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(backendStartupStatusThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.backendReady = action.payload.status === "ready";
        })
        .addCase(backendStartupStatusThunk.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload as string
        })

    }
})

export const { setStartupCompleted } = startupSlice.actions;
export default startupSlice.reducer;