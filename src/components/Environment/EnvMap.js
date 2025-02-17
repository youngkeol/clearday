import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { MoonLoader } from "react-spinners";
import {getEnvColor} from "../../utils/envData";
import classes from "./EnvMap.module.css";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  //InfoWindow,
  //MarkerClusterer
} from "@react-google-maps/api";
import EnvContext from "../../hooks/EnvReducer";
import LoadingBox from "../Common/LoadingBox";

// SVG 마커 생성 함수
const createSvgMarker = (color) => {
  const svg = `
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="3"/>
    </svg>
  `;
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml;charset=UTF-8,${encodedSvg}`;
};

//구글맵 스타일
const myStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

const EnvMap = ({ markers }) => {
  //const [map, setMap] = useState(null);
  const {state, dispatch} = useContext(EnvContext);
  
  const [markerSize, setMarkerSize] = useState(20); //
  const mapCenter = useRef({ lat: 36.2038, lng: 126.8309}); //호버 마커 정보 
  const [hoveredMarker, setHoveredMarker] = useState(null); //  
  const infoWindowRef = useRef(null); // 구글 맵의 InfoWindow 객체를 참조하기 위한 ref

  const [isMarkersLoaded, setIsMarkersLoaded] = useState(false);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    };

    // 화면 크기 변화 감지
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 마커의 SVG 이미지 미리 생성하여 저장
  const markerIcons = useMemo(() => {
    return markers.map(marker => {
      const color = getEnvColor(marker.pm25, "pm25", "rgb");
      return createSvgMarker(color);
    });
  }, [markers]); // markers가 변경될 때만 새로 생성


  //마커 클릭시
  const selectMarkerHandler = ({lat, lng,...data}) => {
     //모바일일 경우, 마커 클릭 시 인포윈도우(호버) 닫기
    if (infoWindowRef.current && isMobile) {
      infoWindowRef.current.close();
      setHoveredMarker(null);
    }

    dispatch({ type: "selectMarker", payload: {lat, lng,...data} });
  
  };


  useEffect(() => {
    if (state.map) {
      const handleZoomChanged = () => {
        const zoom = state.map.getZoom();
        setMarkerSize(zoom < 10 ? 20 : 25);
      };

      const zoomListener = state.map.addListener("zoom_changed", handleZoomChanged);

       // 중심 좌표 변경 시 mapCenter 업데이트
       const handleCenterChanged = () => {
        const center = state.map.getCenter();
        if (center) {
          mapCenter.current = {
            lat: center.lat(),
            lng: center.lng(),
          };
        }
      };

      const centerListener = state.map.addListener("center_changed", handleCenterChanged);

      return () => {
        zoomListener.remove();
        centerListener.remove();
      };
    }
  }, [state.map]);



  //인포윈도우
  useEffect(() => {
    if (state.map && !infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow({
        borderRadius: 5,
        arrowSize: 10,
        borderWidth: 0,
        disableAutoPan: true,
        //arrowPosition: 30,
        pixelOffset: new window.google.maps.Size(0, -12)
      });
    }

    
    if (hoveredMarker && infoWindowRef.current) {
      infoWindowRef.current.setPosition({
        lat: hoveredMarker.lat,
        lng: hoveredMarker.lng,
      });
      
      infoWindowRef.current.setContent(`
        <div class="${classes["infowindow-box"]}">
          <div class="${classes["infowindow-header"]}">
            <h4>${hoveredMarker.station_name}</h4>
            <p>(${hoveredMarker.addr})</p>
          </div>
          <div class="${classes["infowindow-body"]}">
            <p class="${classes["infowindow-body-con"]} ${classes[getEnvColor(hoveredMarker.pm25, "pm25", "color")]}">PM<sub>2.5</sub> &nbsp;: &nbsp;${hoveredMarker.pm25}<sub>㎍/㎥</sub></p>
            <p class="${classes["infowindow-body-con"]} ${classes[getEnvColor(hoveredMarker.pm10, "pm10", "color")]}">PM<sub>10</sub> &nbsp;: &nbsp;${ hoveredMarker.pm10}<sub>㎍/㎥</sub></p>
            <p class="${ classes["infowindow-body-info"]}">(지도 위 마커 클릭 시, 상세한 정보를 볼 수 있습니다.)</p>
          </div>
        </div>
      `);
      infoWindowRef.current.open(state.map);

    } else if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  }, [hoveredMarker, state.map]);

  
  useEffect(() => {
    if (markers.length > 0) {
      setIsMarkersLoaded(true);
    }
  }, [markers]);


  const setMapHandler = (mapInstance) => {
    dispatch({ type: "SET_MAP", payload: mapInstance }); // map 디스패치
  }

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
          zoom={7}
          //onLoad={(mapInstance) => setMap(mapInstance)}
          onLoad={(mapInstance) => setMapHandler(mapInstance)}
          options={{
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            disableDefaultUI: false,
            styles: myStyles,
          }}

        >
          {markers.map((marker, index) => {
            const lat = parseFloat(marker.lat);
            const lng = parseFloat(marker.lng);
            const color = getEnvColor(marker.pm25, "pm25", "rgb");

            if (isNaN(lat) || isNaN(lng)) {
              console.error(
                `Invalid latitude or longitude for marker at index ${index}: lat=${lat}, lng=${lng}`
              );
              return null;
            }

            return (
              <MarkerF
                key={index}
                position={{ lat, lng }}
                icon={{
                  url: markerIcons[index], //createSvgMarker(color),
                  scaledSize: new window.google.maps.Size(
                    markerSize,
                    markerSize
                  ),
                }}
                onClick={() => {
                  selectMarkerHandler({
                      lat,
                      lng,
                      station_name : marker.station_name,
                      area: marker.area,
                      addr:marker.addr,
                      pm25: marker.pm25,
                      pm10: marker.pm10,
                      o3: marker.o3,
                      data_time: marker.data_time
                  });
                }}
                onMouseOver={() =>
                  setHoveredMarker({
                    lat,
                    lng,
                    station_name : marker.station_name,
                    area: marker.area,
                    addr:marker.addr,
                    pm25: marker.pm25,
                    pm10: marker.pm10,
                    o3: marker.o3,
                    data_time: marker.data_time
                  })
                }
                onMouseOut={() => setHoveredMarker(null)}
              />
            );
          })}
        </GoogleMap>
      ) : (
        <LoadingBox 
          height={'100%'}
          title ='데이터를 불러오는 중입니다.'
        />
      )}
    </>
  );
};

export default EnvMap;