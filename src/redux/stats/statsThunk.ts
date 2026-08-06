import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStatsApi } from "../../services/statsApi";

export const fetchStatsThunk = createAsyncThunk(
  "fetch/stats",
  async (_, thunkAPI) => {
    try {
      const response = await fetchStatsApi();
      return response;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(
            error.response?.data || "Stats api call failed"
        )
    }
  },
);
