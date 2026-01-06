import axiosClient from "./axiosClient.jsx";


const authApi = {
    sendOtp: (mobile) => axiosClient.post(`v1/login/send-otp`, { mobile }),
    verifyOtp: (mobile, otp) => axiosClient.post(`v1/login/verify-otp`, {mobile, otp}),
    logout: () => axiosClient.post('v1/logout')
};

export default authApi;
