import React from "react";
import classes from "./SideBox.module.css";

const SideBox = ({ title, addr, closeSideBox, children }) => {
  return (
    <div className={classes["side-box"]}>
      <button className={classes["side-box-close-btn"]} onClick={closeSideBox}>
        <span></span>
        <span></span>
      </button>
      <h2 className={classes["side-box-tit"]}>{title}</h2>
      {addr && <p className={classes["side-box-addr"]}>({addr})</p>}
      {children}
    </div>
  );
};

export default SideBox;
