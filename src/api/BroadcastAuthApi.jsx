import axiosClient from "./axiosClient.jsx";


const BroadcastAuthApi = {
    get: (data) => axiosClient.post(`broadcasting/auth`, data),
};

export default BroadcastAuthApi;
