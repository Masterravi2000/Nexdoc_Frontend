import { createSlice } from "@reduxjs/toolkit";
import { getRecentSearchThunk, searchApiThunk } from "./searchThunk";

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

interface recentSearchResponse {
    id: number,
    query: string,
    searched_at: string
}

// NEW: shape for the AI mode's response
interface AiSource {
    file_name: string;
    file_type: string;
    file_size: string;
    page_number: number | null;
    slide_number: number | null;
    last_modified: string;
}

interface AiResponse {
    answer: string;
    sources: AiSource[];
}

interface searchResult {
    loading: boolean;
    success: boolean;
    error: string | null;
    results: SearchResult[];
    recentSearches: recentSearchResponse[];
    aiResponse: AiResponse | null;
}

const initialState: searchResult = {
    loading: false,
    success: false,
    error: null,
    results: [],
    recentSearches: [],
    aiResponse: null,
}

const searchSlice = createSlice ({
    name: "search",
    initialState,
    reducers: {
        clearAiResponse: (state) => {
            state.aiResponse = null;
        }
    },
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
            
            // Branch based on which shape actually came back
            if ("answer" in action.payload) {
                state.aiResponse = action.payload;
            } else {
                state.results = action.payload.results;
            }
        })
        .addCase(searchApiThunk.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload as string;
        })

        .addCase(getRecentSearchThunk.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null
        })
        .addCase(getRecentSearchThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.recentSearches = action.payload;
        })
        .addCase(getRecentSearchThunk.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload as string;
        });
    }
})

export const { clearAiResponse } = searchSlice.actions;
export default searchSlice.reducer;