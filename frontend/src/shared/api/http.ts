import axios, { type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            toast.error("Sessão expirada", {
                description: "Faça login novamente",
            })
            Cookies.remove("auth_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

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
