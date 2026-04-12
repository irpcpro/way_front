import axiosClient from "./axiosClient.jsx";


const SendMessageApi = {
    send: (data) => axiosClient.post(`v1/message/send`, data),
    attachment: (attachment, id_message_hook) => axiosClient.post(`v1/attachment/upload/${id_message_hook}`, attachment, {
        headers: {
            "Content-Type": undefined
        }
    }),
    makeConversation: (data) => axiosClient.post(`v1/message/make_conversation/${data}`),
};

export default SendMessageApi;
