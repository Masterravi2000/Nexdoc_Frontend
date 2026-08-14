import axiosInstance from "../utils/API/api";

export const backendStartupStatusApi = async () => {
    const response = await axiosInstance("/status")
    return response.data;
}