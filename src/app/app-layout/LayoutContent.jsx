import {createContext} from "react";
import './LayoutContent.css'

export const layoutContent = createContext();

export const LayoutContentContext = ({children}) => {
    return (
        <layoutContent.Provider value={{}}>
            <div id="main-content">
                <div className="wrap">
                    {children}
                </div>
            </div>
        </layoutContent.Provider>
    )
}
