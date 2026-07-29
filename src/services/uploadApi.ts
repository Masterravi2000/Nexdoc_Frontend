import axiosInstance from "../utils/API/api";

// upload api call for image upload
export const uploadImageApi = async (data: FormData) => {
  const response = await axiosInstance.post("/api/upload/images", data);
  return response;
};

//upload api call for pdf upload
export const uploadPdfApi = async (data: FormData) => {
  const response = await axiosInstance.post("/api/upload/pdf", data);
  return response;
};

//upload api call for pptx upload
export const uploadPptxApi = async (data: FormData) => {
  const response = await axiosInstance.post("/api/upload/pptx", data);
  return response;
};

//upload api call for xls upload
export const uploadXlsApi = async (data: FormData) => {
  const response = await axiosInstance.post("/api/upload/xls", data);
  return response;
};

//upload api call for txt upload
export const uploadTxtApi = async (data: FormData) => {
  const response = await axiosInstance.post("/api/upload/txt", data);
  return response;
};
