import * as React from "react";

export const MainContext = React.createContext({
  active : 1
});

export function MainContextProvider({ value, children }) {
    return(
        <MainContext.Provider value={value}>
            {children}
        </MainContext.Provider>
    )
}

export default MainContext