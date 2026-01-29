import axios, { type AxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export const customFetcher = async <T>(
    config: AxiosRequestConfig
): Promise<T> => {
    const response = await api.request<T>(config);
    return response.data;
};
