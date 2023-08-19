import React from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css"

const NavLinks = () => {
    return (
        <div className="nav-links" >
            <button>
                <NavLink to="/" exact className="nav-ul">
                  Home
                </NavLink>
            </button>
            <button>
                <NavLink to="/blog/newblog" exact className="nav-ul"> 
                  NewPost
                </NavLink>
            </button>
            <button>
                <NavLink to="/userid" exact className="nav-ul"> 
                  Profile 
                </NavLink>
            </button>
        </div>
    );
};

export default NavLinks;