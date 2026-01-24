import React, {useContext} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx";
import {config} from "./../../config/globalConfig";
import SpinnerLoading from "./Spinner.jsx";

const PrivateRoute = () => {
    const { isAuthenticated, loading, user} = useContext(AuthContext);

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

    // unless go to the page
    return <Outlet />;
};

export default PrivateRoute;