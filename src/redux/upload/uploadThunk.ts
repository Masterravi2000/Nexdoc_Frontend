import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  uploadImageApi,
  uploadPdfApi,
  uploadPptxApi,
  uploadTxtApi,
  uploadXlsApi,
} from "../../services/uploadApi";

// upload image thunk
export const uploadImageThunk = createAsyncThunk(
  "upload/images",
  async (data: FormData, thunkAPI) => {
    try {
      const response = await uploadImageApi(data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "image upload failed",
      );
    }
  },
);

// upload pdf thunk
export const uploadPdfThunk = createAsyncThunk(
  "upload/pdf",
  async (data: FormData, thunkAPI) => {
    try {
      const response = await uploadPdfApi(data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "pdf upload failed",
      );
    }
  },
);

//upload pptx thunk
export const uploadPptxThunk = createAsyncThunk(
  "upload/pptx",
  async (data: FormData, thunkAPI) => {
    try {
      const response = await uploadPptxApi(data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "pptx upload failed",
      );
    }
  },
);

//upload xls thunk
export const uploadXlsThunk = createAsyncThunk(
  "upload/xls",
  async (data: FormData, thunkAPI) => {
    try {
      const response = await uploadXlsApi(data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "xls upload failed",
      );
    }
  },
);

//upload txt thunk
export const uploadTxtThunk = createAsyncThunk(
  "upload/txt",
  async (data: FormData, thunkAPI) => {
    try {
      const response = await uploadTxtApi(data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "txt upload failed",
      );
    }
  },
);
