import { createAsyncThunk } from "@reduxjs/toolkit";
import downloadFileApi from "../../services/downloadApi";

interface downloadPayload {
  file_name: string;
  file_type: string;
}

const downloadFileThunk = createAsyncThunk(
  "/download/file",
  async ({ file_name, file_type }: downloadPayload, thunkAPI) => {
    try {
      const response = await downloadFileApi(file_name, file_type);
      return response;
    } catch (error: any) {
      thunkAPI.rejectWithValue(
        error.response?.data || "download api call failed",
      );
    }
  },
);

export default downloadFileThunk;
