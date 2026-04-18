import "./UserInfo.css"
import React, {useEffect, useState} from "react";
import {LayoutMainContext} from "../app-layout/LayoutMain.jsx";
import {LayoutHeaderContext} from "../app-layout/LayoutHeader.jsx";
import {LayoutContentContext} from "../app-layout/LayoutContent.jsx";
import {LayoutFooterContext} from "../app-layout/LayoutFooter.jsx";
import ArrowBack from "../components/ArrowBack.jsx";

function UserInfo({user, setOpenChatInfo}){
    const [userInfo, setUserInfo] = useState({})

    useEffect(() => {
        setUserInfo(user[0])
    }, []);

    const handleCloseChatInfo = () => {
        setOpenChatInfo(false);
    }



    return (
        <div className="bg-user-info">
            <LayoutMainContext>
                <LayoutHeaderContext>
                    <ArrowBack action={handleCloseChatInfo} />
                </LayoutHeaderContext>
                <LayoutContentContext>

                    <div className="user-info">
                        <div className="bg-image">
                            {
                                userInfo.avatar
                                    ? <div className="avatar"><img src={userInfo.avatar.url} alt="" /></div>
                                    : <></>
                            }
                        </div>
                        <div className="bg-details">
                            <div className="name">{userInfo.name ?? 'Anonymous'}</div>
                            <div className="online-status">
                                <div className="online-circle"></div>
                                <div className="online-text">Unknown</div>
                            </div>
                        </div>
                    </div>


                </LayoutContentContext>
                <LayoutFooterContext>

                </LayoutFooterContext>
            </LayoutMainContext>
        </div>
    )
}

export default UserInfo;
