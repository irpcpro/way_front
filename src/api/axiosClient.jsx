import axios from "axios";
import {config} from "./../config/globalConfig";
import toast from "react-hot-toast";
import {getToken} from "../app/utils/storage.jsx";

const axiosClient = axios.create({
    baseURL: config.base_url,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// ---------------- INTERCEPTORS ----------------

// Request Interceptor
axiosClient.interceptors.request.use(
    async (request) => {
        // get user token
        const token = getToken();
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
    },
    (error) => {
        toast.error('Authentication Error');
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            if(error.status === 401){
                localStorage.clear();
                return
            }

            if(error.status !== 400 && error.status !== 500)
                toast.error('Unexpected Error');
            return Promise.reject({
                status: false,
                message: error.response.data?.message || "Unexpected Error",
                code: error.response.status,
                data: error.response.data?.data || null,
            });
        }


        toast.error('Error on connecting to the server');
        return Promise.reject({
            status: false,
            message: "Error on connecting to the server",
            code: null,
            data: null,
        });
    }
);

export default axiosClient;
