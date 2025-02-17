import React from "react";
import classes from "./CurEnvItem.module.css";

const CurEnvItem = ({ title, value, unit, status, imgUrl }) => {
  return (
    <li className={classes["env-list-item"]}>
      <h4
        className={classes["env-tit"]}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className={classes["env-icon"]}>
        <img src={imgUrl} alt={status} />
      </div>
      <p className={classes["env-data"]}>
        {value}
        <sub>{unit}</sub>
        <span>({status})</span>
      </p>
    </li>
  );
};

export default CurEnvItem;
