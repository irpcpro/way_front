import {createContext} from "react";
import './LayoutHeader.css'

export const layoutHeader = createContext();

export const LayoutHeaderContext = ({children}) => {
    return (
        <layoutHeader.Provider value={{}}>
            <div id="main-header">
                {children}
            </div>
        </layoutHeader.Provider>
    )
}
