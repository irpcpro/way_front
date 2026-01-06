import {config} from "./../../config/globalConfig";
import toast from "react-hot-toast";
import persianDate from 'persian-date';

const TOKEN_KEY = config.api_token;
const USER_KEY = config.user_details;

export const setAuthData = (access_token, user) => {
    localStorage.setItem(TOKEN_KEY, access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const setUserData = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const getUser = () => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (err) {
        console.warn("Error on reading localstorage", err);
        toast.error('error on getting user details');
        return null;
    }
};

export const getAuthData = () => ({
    token: getToken(),
    user: getUser()
});

export const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const setAuthDataAsync = (access_token, user) =>
    Promise.resolve().then(() => setAuthData(access_token, user));

export const getAuthDataAsync = () =>
    Promise.resolve(getAuthData());

export const getUserDataAsync = () =>
    Promise.resolve(getUser());

export const clearAuthDataAsync = () =>
    Promise.resolve(clearAuthData());


export const getPersianDateTime = () => {
    const pDate = new persianDate();
    return pDate.format('YYYY/MM/DD - HH:mm:ss');
};

