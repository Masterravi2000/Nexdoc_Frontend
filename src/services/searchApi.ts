import axiosInstance from "../utils/API/api";

export const searchApi = async (query: string, mode: string) => {
  const response = await axiosInstance.post("/api/search", {
    query, mode
  });
  return response.data;
};

export const addRecentSearchApi = async (query: string) => {
  const response = await axiosInstance.post("/api/recentSearches/add", {
    query,
  });
  return response.data;
};

export const getRecentSearchApi = async () => {
    const response = await axiosInstance.get("/api/recentSearches/get")
    return response.data;
}

export const deleteRecentSearch = async (id: number) => {
    const response = await axiosInstance.delete(`/api/recentSearches/remove/${id}`)
    return response.data;
}

export const clearRecentSearches = async () => {
    const response = await axiosInstance.delete("/api/recentSearches/clearall")
    return response.data;
}
