import './Search.css'
import {LayoutMainContext} from "../app-layout/LayoutMain.jsx";
import {LayoutContentContext} from "../app-layout/LayoutContent.jsx";
import {LayoutFooterContext} from "../app-layout/LayoutFooter.jsx";
import {LayoutHeaderContext} from "../app-layout/LayoutHeader.jsx";
import HeaderLogo from "../components/HeaderLogo.jsx";
import FooterNav from "../components/FooterNav.jsx";
import HomeSkeletonChats from "../home/HomeSkeletonChats.jsx";
import {useEffect, useState} from "react";
import SearchUserApi from "../../api/SearchUserApi.jsx";
import SearchBox from "../components/SearchBox.jsx";
import toast from "react-hot-toast";
import SearchListMessages from "./SearchListMessages.jsx";

function Search() {
    const [searching, setSearching] = useState(false);
    const [listUsers, setListUsers] = useState([]);
    const [searchText, setSearchText] = useState('');

    const SkeletonLoading = () => (
        <>
            <HomeSkeletonChats />
            <HomeSkeletonChats />
            <HomeSkeletonChats />
            <HomeSkeletonChats />
        </>
    )

    useEffect(() => {
        if(searchText === '') {
            setListUsers([])
            return
        }

        setSearching(true)
        SearchUserApi.search(searchText).then((res)=>{
            setListUsers(res.data)
        }).catch((error)=>{
            toast.error(error.message)
        }).finally(()=>{
            setSearching(false)
        })
    }, [searchText]);

    return (
        <LayoutMainContext>
            <LayoutHeaderContext>

                <div className="bg-search-input">
                    <div className="search-icon"></div>
                    <SearchBox onSearch={setSearchText} searching={searching} delayTime={800} placeholder="Search ID, Phone or Name" />
                </div>

            </LayoutHeaderContext>
            <LayoutContentContext>

                {
                    !searching ? (
                        listUsers.length !== 0 ? (
                            listUsers.map((user) => <SearchListMessages key={user.id_user} item={user} />)
                        ) : searchText !== ''
                            ? <div className="search-for-conversation">Nothing Found ..</div>
                            : <div className="search-for-conversation">Search User</div>
                    ) : (
                        SkeletonLoading()
                    )
                }

            </LayoutContentContext>
            <LayoutFooterContext>
                <FooterNav />
            </LayoutFooterContext>
        </LayoutMainContext>
    );
}

export default Search
