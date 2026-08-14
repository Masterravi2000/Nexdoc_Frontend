import { createAsyncThunk } from "@reduxjs/toolkit";
import { backendStartupStatusApi } from "../../services/statusApi";

export const backendStartupStatusThunk = createAsyncThunk(
    "fetch/startup-status",
    async (_, thunkAPI) => {
        try {
            const response = await backendStartupStatusApi()
            return response;
        } catch (error: any) {
            thunkAPI.rejectWithValue(
                error?.response.payload || "backend startup status api call failed"
            )
        }
    }
)