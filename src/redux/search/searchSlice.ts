import { createSlice } from "@reduxjs/toolkit";
import searchApiThunk from "./searchThunk";

interface SearchResult {
    content: string;
    score: number;
    file_name: string;
    file_type: string;
    file_size: string | null;
    created_on: string | null;
    last_modified: string | null;
    page_number: number | null;
    slide_number: number | null;
    line_start: number | null;
    line_end: number | null;
}

interface searchResult {
    loading: boolean;
    success: boolean;
    error: string | null;
    results: SearchResult[];
}

const initialState: searchResult = {
    loading: false,
    success: false,
    error: null,
    results: []
}

const searchSlice = createSlice ({
    name: "search",
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
            state.results = action.payload.results
        })
        .addCase(searchApiThunk.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload as string;
        })
    }
})

export default searchSlice.reducer;