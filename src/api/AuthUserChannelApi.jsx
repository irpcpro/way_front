import axiosClient from "./axiosClient.jsx";


const AuthUserChannelApi = {
    get: (data) => axiosClient.post(`v1/websocket/auth-user-channel`, data),
};

export default AuthUserChannelApi;
