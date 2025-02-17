import React, { useEffect, useState, useContext } from "react";
import { koreaInfoArr } from "../utils/weatherData";

import WeatherMap from "../components/Weather/WeatherMap";
import WeatherContext from "../hooks/WeatherReducer";
import SideBox from "../components/UI/SideBox";
import { getWeatherIcon, formatDate, formatTime } from "../utils/weatherData";
import classes from "./WeatherPage.module.css";


//처음 데이터 호출
const fetchAllRegionData = async () => {
  try {
    const weatherInfoList = []; // 각 지역별 날씨 정보를 저장할 배열
    const url =`${process.env.REACT_APP_NATURE_DATA_URL}/weather/getCurrentWthrList`;
    const weatherRes = await fetch(url, {
      method : 'GET',
      headers : {
        'Content-Type': 'application/json',
        'servicekey': `${process.env.REACT_APP_NATURE_DATA_API_KEY}`
      }
    });

    if(!weatherRes.ok){
      console.error(`현재 날씨 데이터 호출 실패 : ${url}`);
      throw new Error();
    }

    
    const weatherData = await weatherRes.json();
    const parsingData = await weatherData.response.body.items;

    //반환 데이터 생성
    for (let koreaInfo of koreaInfoArr){
      let weatherDataItem = {
        address: koreaInfo.korName,
        lat: koreaInfo.lat,
        lng: koreaInfo.lng,
        nx: koreaInfo.nx,
        ny: koreaInfo.ny
      }

      for(let weather of parsingData) {
        if(weather.address === koreaInfo.korName) {
          weatherDataItem = {
            region: koreaInfo.korName,
            lat: koreaInfo.lat,
            lng: koreaInfo.lng,
            nx: weather.nx,
            ny: weather.ny,
            fsct_date : weather.fcst_date,
            fcst_time : weather.fcst_time,
            lgt : weather.lgt,
            pty : weather.pty,
            reh : weather.reh,
            rn1 : weather.rn1,
            sky : weather.sky,
            t1h : weather.t1h,
            uuu : weather.uuu,
            vec : weather.vec,
            vvv : weather.vvv,
            wsd : weather.wsd
          }
        }
      }
      weatherInfoList.push(weatherDataItem)
    }
    return weatherInfoList;
  } catch (err){
    console.log(err)
    alert('데이터 호출에 실패했습니다. 잠시 후에 다시 시도해주세요.');
    return [];
  }
};

const WeatherPage = () => {
  const [markers, setMarkers] = useState([]); // 여러 마커 저장
  const { state, dispatch } = useContext(WeatherContext);
  const sideBar = state.sideBar;
  const selectedMaker = state.selectedMarker;
  const sideBarData = state.selectedMarker?.data;

  //처음 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      const weatherDataList = await fetchAllRegionData();
      setMarkers(weatherDataList);

      // 팝업 열려있으면 닫음
      if (state.sideBar) {
        closeSideBoxHandler();
      }
    };
    fetchData(); 
    const intervalId = setInterval(fetchData, 30 *  60 *1000); // 30( 30 *  60 *1000)분마다 데이터 업데이트 됨
    //console.log('Interval started:', intervalId); // Interval ID 확인용
    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(intervalId);
  }, []);

  //사이브바 닫기
  const closeSideBoxHandler = () => {
    dispatch({ type: "deselectMarker" });
  };

  return (
    <div className="weather-page">
      <WeatherMap markers={markers} />
      {sideBar && sideBarData && (
        <SideBox
          title={`${selectedMaker.region} 날씨 현황`}
          closeSideBox={closeSideBoxHandler}
        >
          <h3 className={classes["side-box-sub-tit"]}>날씨 정보</h3>
          <div className={classes["side-box-cur-box"]}>
            <div className={classes["side-box-cur-img"]}>
              <img src={getWeatherIcon(sideBarData[0])} alt="weather" />
            </div>
            <div className={classes["side-box-cur-info"]}>
              <dl>
                <dt>
                  {sideBarData[0]?.fcst_date && sideBarData[0]?.fcst_time ? `${formatDate(sideBarData[0].fcst_date)} ${formatTime(sideBarData[0].fcst_time)}시 날씨`: "-"}
                </dt>
                <dd>
                  온도 : {sideBarData[0]?.t1h ? `${sideBarData[0].t1h}` : "-"}°C
                </dd>
                <dd>
                  습도 : {sideBarData[0]?.reh ? `${sideBarData[0].reh}` : "-"}%
                </dd>
                <dd>
                  강수량 : {sideBarData[0]?.rn1 ? `${sideBarData[0].rn1}` : "-"}
                </dd>
              </dl>
            </div>
          </div>
          <ul className={classes["side-box-forecast-list"]}>
            {[1, 2, 3].map((index) => (
     
              <li key={index}>
                <div>{sideBarData[index]?.fcst_time ? `${formatTime(sideBarData[index].fcst_time)}` : '-'}시</div>
                <div>
                  {sideBarData[index] ? (
                    <img src={getWeatherIcon(sideBarData[index])} alt="weather" />
                  ) : (
                    '-'
                  )}
                </div>
                <div>
                  {sideBarData[index]?.t1h ? sideBarData[index].t1h : '-'}°C / 
                  {sideBarData[index]?.reh ? `${sideBarData[index].reh}` : '-'}%
                </div>
              </li>
            ))}
          </ul>
        </SideBox>
      )}
    </div>
  );
};

export default WeatherPage;
