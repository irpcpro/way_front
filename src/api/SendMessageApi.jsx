import axiosClient from "./axiosClient.jsx";


const SendMessageApi = {
    send: (data) => axiosClient.post(`v1/message/send`, data),
};

export default SendMessageApi;
