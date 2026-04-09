import axiosClient from "./axiosClient.jsx";


const SendMessageApi = {
    send: (data) => axiosClient.post(`v1/message/send`, data),
    makeConversation: (data) => axiosClient.post(`v1/message/make_conversation/${data}`),
};

export default SendMessageApi;
