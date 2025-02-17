import React, { useEffect, useState, useContext } from "react";
import classes from "./EnvPage.module.css";

import SearchBox from "../components/UI/SearchBox";
import SideBox from "../components/UI/SideBox";
import CurEnvList from "../components/Environment/CurEnvList";
import EnvChart from "../components/Environment/EnvChart";
import EnvMap from "../components/Environment/EnvMap";
import EnvContext from "../hooks/EnvReducer";
import AddrSearch from "../components/Common/AddrSearch";
import {
  APIProvider,
} from "@vis.gl/react-google-maps";

const fetchAllRegionsData = async () => {
  try {
    const url =`${process.env.REACT_APP_NATURE_DATA_URL}/env/getCurrentEnvList`;
    const envRes = await fetch(url, {
      method : 'GET',
      headers : {
        'Content-Type': 'application/json',
        'servicekey': `${process.env.REACT_APP_NATURE_DATA_API_KEY}`
      }
    });
    
    if(!envRes.ok){
      console.error(`현재 환경 데이터 호출 실패 : ${url}`);
      throw new Error();
    }

    const envData = await envRes.json();
    const envDataList = await envData.response.body.items;
    return envDataList;

  } catch (error) {
    console.error("지역별 센서 API: ${error}");
    throw new Error(`지역별 센서 API: ${error}`);
    alert('데이터 호출에 실패했습니다. 잠시 후에 다시 시도해주세요.')
    return []; // 오류 발생 시 빈 배열 반환
  }
};



const EnvPage = () => {
  const [markers, setMarkers] = useState([]);
  
  const {state, dispatch} = useContext(EnvContext);
  const sideBar = state.sideBar;
  const selectedMaker = state.selectedMarker;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const envListData = await fetchAllRegionsData();
        setMarkers(envListData);

              // 팝업 열려있으면 닫음
      if (state.sideBar) {
        closeSideBoxHandler();
      }


      } catch(error){
        throw new Error(`측정소 목록 조회 에러: ${error}`);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 30 * 60 * 1000); // 30분마다 데이터 업데이트 됨
    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(intervalId);
  }, []);

  const closeSideBoxHandler = () => { 
    dispatch({type:"deselectMarker"})
  }

  return (
    <div className="env-page">
      <SearchBox>
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
          <AddrSearch />
        </APIProvider>
      </SearchBox>

      <EnvMap 
        markers={markers} 
      />

      {sideBar && 
        <SideBox 
          title={`${selectedMaker.station_name} 대기 환경 현황`} 
          date={selectedMaker.data_time} 
          addr={selectedMaker.addr}
          closeSideBox = {closeSideBoxHandler}
          >
          <h3 className={classes["side-box-sub-tit"]}>
            현재 대기 정보 
            {selectedMaker.data_ime && <span>({selectedMaker.data_time})</span>}
          </h3>
          <CurEnvList 
            data={selectedMaker}
          />
          <h3 className={classes["side-box-sub-tit"]}>미세먼지 변동 그래프</h3>
          <EnvChart
            station_name = {selectedMaker.station_name}
            // series={[
            //   { name: "PM2.5", data: [20, 50, 30, 60] },
            //   { name: "PM10", data: [15, 35, 50, 20] },
            // ]}
            // categories={["22시", "23시", "24시", "1시"]}
          />
        </SideBox>
      }
    </div>
  );
};

export default EnvPage;
