import React from "react";
import classes from "./CurEnvList.module.css";
import CurEnvItem from "./CurEnvItem";

import { getEnvColor } from "../../utils/envData";

const CurEnvList = ({data}) => {
  const pm25 = getEnvColor(data.pm25, "pm25");
  const pm10 = getEnvColor(data.pm10, "pm10");
  const o3 = getEnvColor(data.o3, "o3");

  return (
    <ul className={classes["env-box"]}>
      <CurEnvItem
        title="초미세먼지<span>(PM<sub>2.5</sub>)</span>"
        value={data.pm25 ? data.pm25 : '-'}
        unit="㎍/㎥"
        status={pm25.status}
        imgUrl={pm25.icon}
      />
      <CurEnvItem
        title="미세먼지<span>(PM<sub>10</sub>)</span>"
        value={data.pm10 ? data.pm10 : '-'}
        unit="㎍/㎥"
        status={pm10.status}
        imgUrl={pm10.icon}
      />
      <CurEnvItem
        title="오존 <span>(0<sub>3</sub>)</span>"
        value={data.o3 ? data.o3 : '-'}
        unit="㎍/㎥"
        status={o3.status}
        imgUrl={o3.icon}
      />
    </ul>
  );
};

export default CurEnvList;
