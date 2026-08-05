import axiosInstance from "../utils/API/api";

const downloadFileApi = async (file_name: string, file_type: string) => {
  const response = await axiosInstance.get(
    `/api/download?file_name=${file_name}&file_type=${file_type}`,
    {
        responseType: "blob",
    }
  );
  return response.data;
};

export default downloadFileApi;
