import { createSlice } from "@reduxjs/toolkit";
import searchApiThunk from "./searchThunk";

interface searchResult {
    loading: boolean;
    success: boolean;
    error: string | null;
    result: string | null;
}

const initialState: searchResult = {
    loading: false,
    success: false,
    error: null,
    result: null
}

const searchSlice = createSlice ({
    name: "searchResults",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        
        .addCase(searchApiThunk.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(searchApiThunk.fulfilled, (state, action) =>  {
            state.loading = false;
            state.success = true;
            state.result = action.payload.results
        })
        .addCase(searchApiThunk.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload as string;
        })
    }
})

export default searchSlice;