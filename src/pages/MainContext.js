import * as React from "react";
import {useState, useContext} from 'react';

const MainContext = React.createContext({
    key : "none",
});

function MainContextProvider({ value, children }) {
    const [key, setKey] = useState('none');
    return(
        <MainContext.Provider value={{key, setKey}}>
            {children}
        </MainContext.Provider>
    )
}
const useMainContext = () => useContext(MainContext);

export { MainContextProvider, useMainContext };
