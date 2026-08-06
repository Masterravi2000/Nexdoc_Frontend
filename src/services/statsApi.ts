import axiosInstance from "../utils/API/api";

export const fetchStatsApi = async () => {
    const response = await axiosInstance.get("/api/stats")
    return response.data
}