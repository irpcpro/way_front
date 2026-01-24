import {createContext} from "react";
import './LayoutFooter.css'

export const layoutFooter = createContext();

export const LayoutFooterContext = ({children}) => {
    return (
        <layoutFooter.Provider value={{}}>
            <div id="main-footer">
                {children}
            </div>
        </layoutFooter.Provider>
    )
}
