import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {config} from "./../../config/globalConfig";
import {clearAuthData, clearAuthDataAsync, getToken, setAuthData} from "../utils/storage.jsx";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = (access_token, user) => {
        setAuthData(access_token, user)
        setIsAuthenticated(true);
        navigate('/');
    };

    const logout = () => {
        clearAuthDataAsync().then(()=>{
            setIsAuthenticated(false);
            navigate(config.routes.login);
        })
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};