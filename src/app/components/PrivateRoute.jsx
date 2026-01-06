import React, { useContext } from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx";
import {config} from "./../../config/globalConfig";
import SpinnerLoading from "./Spinner.jsx";
import {getUser} from "../utils/storage.jsx";
import toast from "react-hot-toast";

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    // هنوز AuthContext لود نشده → هیچ کاری نکن
    if (loading) {
        return (
            <div className="spinner-bg">
                <SpinnerLoading />
            </div>
        );
    }

    // if is not logged in
    if (!isAuthenticated) {
        return <Navigate to={config.routes.login} replace />;
    }

    // check profile
    const user = getUser();
    const isProfileIncomplete =
        !user ||
        !user.full_name ||
        !user.company_name ||
        !user.job_title ||
        !Array.isArray(user.interests) ||
        user.interests.length === 0;

    // check if user profile is not completed & also is not in profile page, redirect him
    if (isProfileIncomplete && location.pathname !== config.routes.profile){

        toast.error('لطفا اطلاعات خود را تکمیل کنید')
        return <Navigate to={config.routes.profile} replace />;
    }

    // unless go to the page
    return <Outlet />;
};

export default PrivateRoute;