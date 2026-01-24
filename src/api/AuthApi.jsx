import axiosClient from "./axiosClient.jsx";


const authApi = {
    sendOtp: (mobile) => axiosClient.post(`v1/auth/send_code`, { mobile }),
    verifyOtp: (mobile, code) => axiosClient.post(`v1/auth/confirmation_code`, {mobile, code}),
    logout: () => axiosClient.post('v1/logout')
};

export default authApi;
