import "./EditProfile.css"
import {LayoutHeaderContext} from "../app-layout/LayoutHeader.jsx";
import {LayoutContentContext} from "../app-layout/LayoutContent.jsx";
import {LayoutFooterContext} from "../app-layout/LayoutFooter.jsx";
import {LayoutMainContext} from "../app-layout/LayoutMain.jsx";
import React from "react";
import ArrowBack from "../components/ArrowBack.jsx";

function EditProfile(){

    return (
        <LayoutMainContext>
            <LayoutHeaderContext>
                <div className="header-row">
                    <ArrowBack />
                    <div className="title">Edit Profile</div>
                </div>
            </LayoutHeaderContext>
            <LayoutContentContext>

            </LayoutContentContext>
            <LayoutFooterContext>

            </LayoutFooterContext>
        </LayoutMainContext>
    );
}

export default EditProfile;