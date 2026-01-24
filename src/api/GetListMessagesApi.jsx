import axiosClient from "./axiosClient.jsx";


const GetListMessagesApi = {
    getListMessages: () => axiosClient.get(`v1/message/list`),
};

export default GetListMessagesApi;
