import { createAsyncThunk } from "@reduxjs/toolkit";
import searchApi from "../../services/searchApi";

const searchApiThunk = createAsyncThunk(
  "document/search",
  async (query: string, thunkAPI) => {
    try {
      const response = await searchApi(query);
      return response;
    } catch (error: any) {
      thunkAPI.rejectWithValue(
        error.response?.data || "search api call failed",
      );
    }
  },
);

export default searchApiThunk;
