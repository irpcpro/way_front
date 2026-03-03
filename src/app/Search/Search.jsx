import './Search.css'
import {LayoutMainContext} from "../app-layout/LayoutMain.jsx";
import {LayoutContentContext} from "../app-layout/LayoutContent.jsx";
import {LayoutFooterContext} from "../app-layout/LayoutFooter.jsx";
import {LayoutHeaderContext} from "../app-layout/LayoutHeader.jsx";
import HeaderLogo from "../components/HeaderLogo.jsx";
import FooterNav from "../components/FooterNav.jsx";
import HomeSkeletonChats from "../home/HomeSkeletonChats.jsx";
import {useState} from "react";

function Search() {
    const [searching, setSearching] = useState(false);
    const [listUsers, setListUsers] = useState([]);

    const SkeletonLoading = () => (
        <>
            <HomeSkeletonChats />
            <HomeSkeletonChats />
            <HomeSkeletonChats />
            <HomeSkeletonChats />
        </>
    )

    return (
        <LayoutMainContext>
            <LayoutHeaderContext>

                <div className="bg-search-input">
                    <div className="search-icon"></div>
                    <input
                        placeholder="Search ID, Phone or Name"
                        className="search-input"
                        type="text"
                    />
                </div>

            </LayoutHeaderContext>
            <LayoutContentContext>

                {
                    !searching ? (
                        listUsers.length !== 0 ? (
                            <>list</>
                        ) : (
                            <div className="search-for-conversation">Search User</div>
                        )
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
