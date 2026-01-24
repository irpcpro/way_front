import axiosClient from "./axiosClient.jsx";


const AuthMessagesApi = {
    get: (data) => axiosClient.post(`v1/websocket/auth-new-messages`, data),
};

export default AuthMessagesApi;
