import axiosClient from "./axiosClient.jsx";


const UserEditProfileApi = {
    checkUsername: (username) => axiosClient.post(`v1/user/info/check-username`, {username}),
    updateProfile: (data) => axiosClient.put(`v1/user/info/update`, data),
};

export default UserEditProfileApi;
