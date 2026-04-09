import {useNavigate} from "react-router-dom";
import React from "react";

function ArrowBack(){
    const navigate = useNavigate();
    return (
        <div className="arrow-back" onClick={() => navigate(-1)}></div>
    )
}

export default ArrowBack;
