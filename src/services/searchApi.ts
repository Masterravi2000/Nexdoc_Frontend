import axiosInstance from "../utils/API/api";

const searchApi = async (query: string) =>{
    const response = await axiosInstance.post(`/api/search/${query}`)
    return response.data;
}

export default searchApi;