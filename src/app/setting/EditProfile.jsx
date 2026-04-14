import "./EditProfile.css"
import {LayoutHeaderContext} from "../app-layout/LayoutHeader.jsx";
import {LayoutContentContext} from "../app-layout/LayoutContent.jsx";
import {LayoutFooterContext} from "../app-layout/LayoutFooter.jsx";
import {LayoutMainContext} from "../app-layout/LayoutMain.jsx";
import React, {useEffect, useRef, useState} from "react";
import ArrowBack from "../components/ArrowBack.jsx";
import {getUser, getUserDataAsync, setUserData} from "../utils/storage.jsx";
import {config} from "../../config/globalConfig.jsx";
import UserEditProfileApi from "../../api/UserEditProfileApi.jsx";
import toast from "react-hot-toast";
import SpinnerLoading from "../components/Spinner.jsx";
import FooterNav from "../components/FooterNav.jsx";


function EditProfile(){
    const [currentUser, setCurrentUser] = useState(null);
    const [inputName, setInputName] = useState("");
    const [inputUsername, setInputUsername] = useState("");
    const [inputGender, setInputGender] = useState(1);
    const debounceTimeout = useRef(null);
    const [usernameChecking, setUsernameChecking] = useState(false);
    const [usernameCheckErrorText, setUsernameCheckErrorText] = useState(null);
    const [firstUsernameChecking, setFirstUsernameChecking] = useState(false);
    const [finalUsername, setFinalUsername] = useState(null);
    const [formCanSubmit, setFormCanSubmit] = useState(true);
    const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
    const delayTime = 700;

    useEffect(() => {
        setCurrentUser(getUser())
        console.log('getUser()', getUser())
    }, []);

    useEffect(() => {
        if(currentUser){
            console.log('currentUser',currentUser.avatar.id_avatar)
            console.log('currentUser',currentUser.avatar.url)

            setInputName(currentUser.name)
            setInputUsername(currentUser.username)
            setInputGender(currentUser.gender === config.enum.gender.man? 1 : 0)
        }
    },[currentUser])

    const onChangeName = (name) => {
        const newName = name.target.value;
        if (newName.length > 25) {
            return;
        }
        setInputName(newName);
    }

    const onChangeGender = (gender) => {
        setInputGender(gender)
    }

    const checkUsername = (username) => {
        if(usernameChecking) return;

        setUsernameChecking(true)
        clearTimeout(debounceTimeout.current)
        UserEditProfileApi.checkUsername(username).then(res => {
            if(res.data.is_exists) {
                setUsernameCheckErrorText(`${username} has already taken`);
                setFinalUsername(null)
                setFormCanSubmit(false)
            }else{
                setUsernameCheckErrorText(null);
                setFinalUsername(username)
                setFormCanSubmit(true)
            }
        }).catch((error)=>{
            toast.error(error.message);
        }).finally(()=>{
            setUsernameChecking(false)
            setFirstUsernameChecking(true)
        })
    }

    const onChangeUsername = (name) => {
        const newName = name.target.value;

        if (newName.length > 20) {
            return;
        }

        if (newName.includes(' ')) {
            return;
        }

        const validCharsRegex = /^[a-zA-Z0-9_]+$/;
        if (!validCharsRegex.test(newName)) {
            return;
        }

        setFormCanSubmit(false)
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            checkUsername(newName);
        }, delayTime);
        setInputUsername(newName);
    }

    useEffect(() => {
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, []);

    const onFormSubmit = () => {
        if(!formCanSubmit) return;

        setUpdateProfileLoading(true)
        let data = {
            name : inputName,
            username : inputUsername,
            gender : inputGender
        };
        UserEditProfileApi.updateProfile(data).then(res => {
            // update session
            getUserDataAsync().then(oldUserData => {

                setUserData({
                    ...oldUserData,
                    name: res.data.name,
                    gender: res.data.gender_name,
                    username: res.data.username,
                })
            })
        }).catch((error)=>{
            toast.error(error.message);
        }).finally(()=>{
            setUpdateProfileLoading(false)
        })
    }

    return (
        <LayoutMainContext>
            <LayoutHeaderContext>
                <div className="header-row">
                    <ArrowBack />
                    <div className="title">Edit Profile</div>
                </div>
            </LayoutHeaderContext>
            <LayoutContentContext>
                {updateProfileLoading && <div className="spinner-bg faded"><SpinnerLoading /></div>}
                {
                    currentUser
                        ? <div className="edit-profile-container">
                            <div className="setting-avatar">
                                {currentUser.avatar && currentUser.avatar.url && (<img src={currentUser.avatar.url} alt=""/>)}
                            </div>
                            <div className="full-name">
                                {inputName ? inputName : '---'}
                            </div>
                            <div className="bg-form">
                                <div className="bg-forms">
                                    <label htmlFor="fullname">Fullname <span>(Less than 25 character)</span></label>
                                    <input
                                        className="edit-profile-textbox"
                                        id="fullname"
                                        type="text"
                                        value={inputName}
                                        onChange={(e) => onChangeName(e)}
                                    />
                                </div>
                                <div className="bg-forms">
                                    <label htmlFor="username">Username <span>(Less than 20 character)</span></label>
                                    <input
                                        className="edit-profile-textbox"
                                        id="username"
                                        type="text"
                                        value={inputUsername}
                                        onChange={(e) => onChangeUsername(e)}
                                    />
                                    {
                                        usernameChecking
                                            ? (
                                                <div className="circle-loading checking-username">
                                                    <div className="circle"></div>
                                                    <div className="circle"></div>
                                                    <div className="circle"></div>
                                                </div>
                                            )
                                            : (
                                                usernameCheckErrorText !== null
                                                    ? <div className="error-text">{usernameCheckErrorText}</div>
                                                    : (
                                                        firstUsernameChecking && <div className="username-situation">
                                                            <div className="username-ok"></div><span>{finalUsername} is Ok</span>
                                                        </div>
                                                    )
                                            )
                                    }
                                </div>
                                <div className="bg-forms">
                                    <label>Gender</label>
                                    <div className="bg-gender">
                                        <div onClick={() => onChangeGender(1)} className={`gender-item ${inputGender && 'selected'}`}>
                                            <div className="bg-icon man"></div>
                                            <div className="bg-title">Man</div>
                                        </div>
                                        <div onClick={() => onChangeGender(0)} className={`gender-item ${!inputGender && 'selected'}`}>
                                            <div className="bg-icon woman"></div>
                                            <div className="bg-title">Woman</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-forms">
                                    <button onClick={onFormSubmit} className={`edit-profile-submit ${!formCanSubmit && 'error'}`}>Save</button>
                                </div>
                            </div>
                        </div>
                        : <>
                            <div className="setting-avatar"></div>
                        </>
                }
            </LayoutContentContext>
            <LayoutFooterContext>
                <FooterNav />
            </LayoutFooterContext>
        </LayoutMainContext>
    );
}

export default EditProfile;