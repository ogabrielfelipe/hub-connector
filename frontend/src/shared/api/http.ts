import axios, { type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export const customFetcher = async <T>(
    config: AxiosRequestConfig
): Promise<T> => {


    const token = Cookies.get("auth_token")

    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`
        }
    }

    const response = await api.request<T>(config);
    return response.data;
};
