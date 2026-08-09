import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  searchApi,
  addRecentSearchApi,
  getRecentSearchApi,
  deleteRecentSearch,
  clearRecentSearches,
} from "../../services/searchApi";

interface searchPayload {
  query: string;
  mode: string;
}

export const searchApiThunk = createAsyncThunk(
  "document/search",
  async ({query, mode}: searchPayload, thunkAPI) => {
    try {
      const response = await searchApi(query, mode);
      return response;
    } catch (error: any) {
      thunkAPI.rejectWithValue(
        error.response?.data || "search api call failed",
      );
    }
  },
);

export const addRecentSearchThunk = createAsyncThunk(
  "add-recent/searches",
  async (query: string, thunkAPI) => {
    try {
      const response = await addRecentSearchApi(query);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "recent search api call for add failed",
      );
    }
  },
);

export const getRecentSearchThunk = createAsyncThunk(
  "get-recent/searches",
  async (_, thunkAPI) => {
    try {
      const response = await getRecentSearchApi();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "recent search api call for get failed",
      );
    }
  },
);

export const deleteRecentSearchThunk = createAsyncThunk(
  "delete-recent/searches",
  async (id: number, thunkAPI) => {
    try {
      const response = await deleteRecentSearch(id);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "recent search api call for delete failed",
      );
    }
  },
);

export const clearRecentSearchThunk = createAsyncThunk(
  "clear-recent/searches",
  async (_, thunkAPI) => {
    try {
      const response = await clearRecentSearches();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "recent search api call for clear failed",
      );
    }
  },
);
