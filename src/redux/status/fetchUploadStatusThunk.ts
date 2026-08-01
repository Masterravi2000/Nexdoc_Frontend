import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadStatusApi } from "../../services/uploadStatusApi";

export const fetchUploadStatusThunk = createAsyncThunk(
  "upload/status",
  async (fileId: string, thunkAPI) => {
    try {
      const response = await uploadStatusApi(fileId);
      return {
        fileId,
        filename: response.filename,
        status: response.status,
        error: response.error,
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "upload status fetching failed",
      );
    }
  },
);
