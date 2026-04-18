import {useNavigate} from "react-router-dom";
import React from "react";

function ArrowBack({action = null}){
    const navigate = useNavigate();

    const handleOnClick = () => {
        if(action !== null){
            action?.()
        }else{
            navigate(-1)
        }
    }

    return (
        <div className="arrow-back" onClick={handleOnClick}></div>
    )
}

export default ArrowBack;
