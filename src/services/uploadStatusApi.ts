import axiosInstance from "../utils/API/api";

export const uploadStatusApi = async (fileId: string) => {
    const response = await axiosInstance.get(`/api/status/${fileId}`)
    return response.data
}