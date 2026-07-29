import { createSlice } from "@reduxjs/toolkit"
import { fetchUploadStatusThunk } from "./fetchUploadStatusThunk"


interface statusState {
    loading: boolean
    success: boolean
    error: string | null
    status: string | null
}

const initialState: statusState = {
    loading: false,
    success: false,
    error: null,
    status: null,
}

const statusSlice = createSlice({
    name:  "fetchStatus",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

        .addCase(fetchUploadStatusThunk.pending, (state) => {
            state.loading = true
            state.success = false
            state.error = null
        })
        .addCase(fetchUploadStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            state.success = true
            state.status = action.payload.status
        })
        .addCase(fetchUploadStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.payload as string
        })
    }
})

export default statusSlice.reducer