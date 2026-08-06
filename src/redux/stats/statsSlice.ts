import { createSlice } from "@reduxjs/toolkit";
import { fetchStatsThunk } from "./statsThunk";

interface statsData {
  total_files: number;
  today_files: number;
  total_searches: number;
  total_downloads: number;

  pdf_count: number;
  pdf_today: number;

  xls_count: number;
  xls_today: number;

  pptx_count: number;
  pptx_today: number;

  txt_count: number;
  txt_today: number;

  png_count: number;
  png_today: number;

  jpg_count: number;
  jpg_today: number;

  jpeg_count: number;
  jpeg_today: number;
}

interface statsState {
  loading: boolean;
  success: boolean;
  error: string | null;
  statsData: statsData;
}

const initialState: statsState = {
  loading: false,
  success: false,
  error: null,
  statsData: {
    total_files: 0,
    today_files: 0,
    total_searches: 0,
    total_downloads: 0,
    pdf_count: 0,
    pdf_today: 0,
    xls_count: 0,
    xls_today: 0,
    pptx_count: 0,
    pptx_today: 0,
    txt_count: 0,
    txt_today: 0,
    png_count: 0,
    png_today: 0,
    jpg_count: 0,
    jpg_today: 0,
    jpeg_count: 0,
    jpeg_today: 0,
  },
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchStatsThunk.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(fetchStatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.statsData = action.payload;
      })
      .addCase(fetchStatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export default statsSlice.reducer;
