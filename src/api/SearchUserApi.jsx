import axiosClient from "./axiosClient.jsx";


const SearchUserApi = {
    search: (data) => axiosClient.get(`v1/search-user/search?query=${data}`),
    searchUser: (id) => axiosClient.get(`v1/search-user/id?id=${id}`),
};

export default SearchUserApi;
