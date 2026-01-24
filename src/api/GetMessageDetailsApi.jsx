import axiosClient from "./axiosClient.jsx";


const GetMessageDetailsApi = {
    getMessageDetails: (message_hook, page) => axiosClient.get(`v1/message/get/${message_hook}?page=${page}`),
};

export default GetMessageDetailsApi;
