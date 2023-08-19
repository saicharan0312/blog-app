import React from "react";
import NavLinks from "./NavLinks";
import SearchBar from "./SearchBar";
import "./MainNavigation.css"

const MainNavigation = () => {
    return (
        <>
          <nav className="main-navigation">
            <div className="m-search-bar">
              <SearchBar />
            </div>
            <div className="m-nav-links">
              <NavLinks />
            </div>
          </nav>
          <div className="m-nav-links-bottom">
            <NavLinks />
          </div>
        </>
    );
};

export default MainNavigation;