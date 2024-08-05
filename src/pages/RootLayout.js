import {Outlet} from "react-router-dom"
import MainNavigation from "./MainNavigation"
import { isActive, setActive } from "../components/common";
import React from "react";
import { MainContextProvider } from "./MainContext";

const RootLayout = () => {
  const [active, setActive0 ] = React.useState(isActive());
  function setActive1(b) {
    setActive0(b)
    setActive(b)
  }
  /*
  <MainContext.Provider value={
    { active, setActive }
  }>
    <MainNavigation active={active}/>         
    <Outlet />
  <MainContext.Provider/>
  */
    return(
        <div>
            <MainNavigation />
            <Outlet />
        </div>

    )
}

export default RootLayout;