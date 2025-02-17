import React from "react";
import Header from "../components/Common/Header";
import { Outlet } from "react-router-dom";

const LayoutPage = () => {
  return (
    <div className="wrapper">
      <Header />
      <div className="contents">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutPage;
