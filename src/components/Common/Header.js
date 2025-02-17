import React from "react";
import classes from "./Header.module.css";
import logo from "../../assets/images/logo.png";
import { NavLink, Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation(); // 현재 경로 가져오기

  return (
    <header className={classes.header}>
      <h1 className={classes.logo}>
        <Link to="/">
          <img src={logo} alt="T없이맑은날로고"/>
          <span className="hidden">T없이맑은날</span>
        </Link>
      </h1>
      <nav>
        <ul className={classes.gnb}>
          <li className={location.pathname === "/" ? classes.active : ""}>
            <NavLink
              to="/"
              end
            >
              날씨 현황
            </NavLink>
          </li>
          <li className={location.pathname === "/environment" ? classes.active : ""}>
            <NavLink
              to="/environment"
              end
            >
              대기 환경 현황
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
