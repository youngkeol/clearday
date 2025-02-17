import React, { useState, useRef, useEffect, useContext } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  //MarkerF,
  InfoWindow,
  //MarkerClusterer
} from "@react-google-maps/api";

import koreaGeoJson from "../../data/korea.json";
import { getWeatherIcon } from "../../utils/weatherData";
import classes from "./WeatherMap.module.css";
import WeatherContext from "../../hooks/WeatherReducer";
import LoadingBox from "../Common/LoadingBox";

//구글맵 스타일
const myStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

// 구글 맵 geojson 폴리곤 스타일 설정 함수
const getPolygonStyle = (isHovered) => ({
  fillColor: isHovered ? "#4682B4" : "blue",
  strokeColor: "white",
  strokeWeight: isHovered ? 2 : 1,
  fillOpacity: isHovered ? 0.6 : 0.2,
});

const WeatherMap = ({ markers }) => {
  const { state, dispatch } = useContext(WeatherContext);

  const [map, setMap] = useState(null);
  const mapCenter = useRef({ lat: 36.2038, lng: 126.8309 });
  const [hoveredMarker, setHoveredMarker] = useState(null);

  const [isMarkersLoaded, setIsMarkersLoaded] = useState(false);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });


  // markers 완전 로딩 확인
  useEffect(() => {
    if (markers && markers.length > 0) {
      setIsMarkersLoaded(true);
    }
  }, [markers]);

  useEffect(() => {
    if (map) {
      // 이전 GeoJSON 데이터 제거
      map.data.forEach((feature) => {
        map.data.remove(feature);
      });

      koreaGeoJson.features.forEach((feature) => {
        map.data.addGeoJson(feature); // GeoJSON 파일을 맵에 추가
      });

      // 기본 스타일 설정
      map.data.setStyle((feature) => {
        const isHovered =
          feature.properties && feature.properties.CTP_KOR_NM === hoveredMarker;
        return getPolygonStyle(isHovered);
      });

      // 폴리곤 마우스 오버아웃 이벤트 설정
      map.data.addListener("mouseover", (event) => {
        setHoveredMarker(event.feature.Fg.CTP_KOR_NM);
        highlightPolygon(map, event.feature.Fg.CTP_KOR_NM);
      });
      // 폴리곤 마웃 아웃 이벤트 설정
      map.data.addListener("mouseout", (event) => {
        setHoveredMarker(null);
        resetPolygonStyle(map);
      });

      map.data.addListener("click", (event) => {
        selectMarkerHandler({ region: event.feature.Fg.CTP_KOR_NM });
      });
    }
  }, [map]);

  // 폴리곤 강조 함수
  const highlightPolygon = (map, polygonName) => {
    let featureToHighlight = null;
    if (map.data) {
      map.data.forEach((feature) => {
        if (feature.getProperty("CTP_KOR_NM") === polygonName) {
          featureToHighlight = feature;
        }
      });

      if (featureToHighlight) {
        map.data.overrideStyle(featureToHighlight, {
          fillColor: "#4682B4",
          strokeColor: "white",
          strokeWeight: 2,
          fillOpacity: 0.6,
        });
      }
    }
  };

  // 폴리곤 강조 해제 함수
  const resetPolygonStyle = (map) => {
    map.data.forEach((feature) => {
      if (feature.getProperty("CTP_KOR_NM")) {
        map.data.revertStyle();
      }
    });
  };


  //마커 클릭 인벤트
  const selectMarkerHandler = async ({ region }) => {
    //API 호출
    try {
      //지역 정보 호출
      const regionUrl =`${process.env.REACT_APP_NATURE_DATA_URL}/weather/getAreaList`;
      const regionRes = await fetch(regionUrl, {
        method : 'GET',
        headers : {
          'Content-Type': 'application/json',
          'servicekey': `${process.env.REACT_APP_NATURE_DATA_API_KEY}`
        }
      });


      if(!regionRes.ok){
        console.error(`지역 데이터 호출 실패 : ${regionUrl}`);
        throw new Error();
      }


      const regionData = await regionRes.json()
      const regionParsingData = await regionData.response.body.items;
      const regionInfo = regionParsingData.find((info) => info.address === region);


      //현재 날씨 데이터 호출
      const currentUrl =`${process.env.REACT_APP_NATURE_DATA_URL}/weather/getCurrentWthrList?nx=${regionInfo.nx}&ny=${regionInfo.ny}`;
      const currnetRes= await fetch(currentUrl, {
        method : 'GET',
        headers : {
          'Content-Type': 'application/json',
          'servicekey': `${process.env.REACT_APP_NATURE_DATA_API_KEY}`
        }
      });

      if(!currnetRes.ok){
        console.error(`현재 날씨 데이터 호출 실패 : ${currentUrl}`);
        throw new Error();
      }
      const currentData = await currnetRes.json();
      const currnetParsingData = await currentData.response.body.items[0];

      //날씨 에보 호출
      const forcastUrl =`${process.env.REACT_APP_NATURE_DATA_URL}/weather/getForecastWthrList?nx=${regionInfo.nx}&ny=${regionInfo.ny}`;
      const forcastRes= await fetch(forcastUrl, {
        method : 'GET',
        headers : {
          'Content-Type': 'application/json',
          'servicekey': `${process.env.REACT_APP_NATURE_DATA_API_KEY}`
        }
      });
      if(!forcastRes.ok){
        console.error(`날씨 예보 데이터 호출 실패 : ${forcastUrl}`);
        throw new Error();
      }
      const forcastData = await forcastRes.json();
      const forcastParsingData = await forcastData.response.body.items;

      dispatch({
        type: "selectMarker",
        payload: { region, data: [currnetParsingData, ...forcastParsingData] },
      });
    } catch (err){
      //console.log(err)
      alert("데이터 호출에 실패했습니다.\n 잠시 후 다시 시도해 주세요");
      return null;
    }
  };

  // 로딩 바와 지도의 조건부 렌더링
  if (!isLoaded || !isMarkersLoaded) {
    return (
      <LoadingBox 
        height={'100%'}
        title ='데이터를 불러오는 중입니다.'
      />
    );
  }

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter.current}
          onLoad={(mapInstance) => setMap(mapInstance)}
          zoom={7}
          options={{
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            disableDefaultUI: false,
            styles: myStyles,
          }}
        >
          {markers.map((marker, index) => {
            const isActive = hoveredMarker === marker.region; // 현재 활성화된 인포윈도우 체크
            const zIndex = hoveredMarker === marker.region ? 1000 : 1; // 마우스 오버 시 z-index 높이기

            return (
              <InfoWindow
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                options={{
                  pixelOffset: new window.google.maps.Size(0, 10),
                  zIndex,
                }} // 마커 위치 수정
              >
                <div
                  onClick={() => selectMarkerHandler(marker)}
                  onMouseOver={(event) => {
                    highlightPolygon(map, marker.region); // 폴리곤 강조
                    setHoveredMarker(marker.region); // 현재 인포윈도우 활성화
                  }}
                  onMouseOut={() => {
                    resetPolygonStyle(map); // 폴리곤 강조 해제
                    setHoveredMarker(null); // 인포윈도우 비활성
                  }}
                  className={`${classes["infowindow-box"]} ${
                    isActive ? classes.active : ""
                  }`}
                >
                  <h3 className={`${classes["infowindow-tit"]}`}>
                    {marker.region}
                  </h3>
                  <img
                    src={getWeatherIcon(marker)}
                    alt="weather icon"
                    className={`${classes["infowindow-icon"]}`}
                  />
                  <div className={`${classes["infowindow-temp-humid"]}`}>
                    {`${marker?.t1h ? marker?.t1h :'-'}°C / ${marker?.reh ? marker.reh : '-'}%`}
                  </div>
                </div>
              </InfoWindow>
            );
          })}
        </GoogleMap>
      ) : (
        <LoadingBox height={"100%"} title="데이터를 불러오는 중입니다." />
      )}
    </>
  );
};

export default WeatherMap;
