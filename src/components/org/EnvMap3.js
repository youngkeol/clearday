import React, { useState, useEffect, useRef, useContext } from "react";
import { MoonLoader } from "react-spinners";
import {getEnvColor} from "../../utils/envData";
import classes from "./EnvMap.module.css";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  //InfoWindow,
  MarkerClusterer
} from "@react-google-maps/api";
import EnvContext from "../../hooks/EnvReducer";
import LoadingBox from "../Common/LoadingBox";

// SVG 마커 생성 함수
const createSvgMarker = (color) => {
  console.log('aaa')
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
  const {state, dispatch} = useContext(EnvContext);
  
  //const [map, setMap] = useState(null);
  const [markerSize, setMarkerSize] = useState(20);
  const [hoveredMarker, setHoveredMarker] = useState(null);


  const mapCenter = useRef({ lat: 37.580468, lng: 127.008643 }); //호버 마커 정보 
  const infoWindowRef = useRef(null); // 구글 맵의 InfoWindow 객체를 참조하기 위한 ref

  const [isMarkersLoaded, setIsMarkersLoaded] = useState(false);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });


  //마커 클릭시
  const selectMarkerHandler = ({lat, lng,...data}) => {
    dispatch({ type: "selectMarker", payload: {lat, lng,...data} });
    console.log(data)
    if(state.map) {
      state.map.panTo( {lat, lng} );
      state.map.setZoom(13);
    }
  };


  useEffect(() => {
    if (state.map) {
      const handleZoomChanged = () => {
        const zoom = state.map.getZoom();
        setMarkerSize(zoom < 10 ? 20 : 25);
      };

      //const zoomListener = state.map.addListener("zoom_changed", handleZoomChanged);

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
        //zoomListener.remove();
        centerListener.remove();
      };
    }
  }, [state.map]);




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
        <div>
          <div class="${classes["infowindow-header"]}">
            <h4>${hoveredMarker.stationName}</h4>
            <p>(${hoveredMarker.addr})</p>
          </div>
          <div class="${classes["infowindow-body"]}">
            <p class="${classes["infowindow-body-con"]} ${classes[getEnvColor(hoveredMarker.pm25Value, "pm25", "color")]}">PM<sub>2.5</sub> &nbsp;: &nbsp;${hoveredMarker.pm25Value}<sub>㎍/㎥</sub></p>
            <p class="${classes["infowindow-body-con"]} ${classes[getEnvColor(hoveredMarker.pm10Value, "pm10", "color")]}">PM<sub>10</sub> &nbsp;: &nbsp;${ hoveredMarker.pm10Value}<sub>㎍/㎥</sub></p>
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
      />
    );
  }

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter.current}
          zoom={8}
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
          <MarkerClusterer
          
          options={{
            gridSize: 10,
            styles: [{
              textColor: '#ffffff',
              url: createSvgMarker('blue'), // 클러스터 아이콘 URL
              height: 50,
              width: 50,
            }]
          }}
          >
          {clusterer => markers.map((marker, index) => {
            const lat = parseFloat(marker.dmX);
            const lng = parseFloat(marker.dmY);
            const color = getEnvColor(marker.pm25Value, "pm25", "rgb");

            if (isNaN(lat) || isNaN(lng)) {
              console.error(
                `Invalid latitude or longitude for marker at index ${index}: lat=${lat}, lng=${lng}`
              );
              return null;
            }

            return (
              <MarkerF
              clusterer={clusterer}
                key={index}
                position={{ lat, lng }}
                icon={{
                  url: createSvgMarker(color),
                  scaledSize: new window.google.maps.Size(
                    markerSize,
                    markerSize
                  ),
                }}
                onClick={() => {
                  selectMarkerHandler({
                      lat,
                      lng,
                      stationName: marker.stationName,
                      addr:marker.addr,
                      pm25Value: marker.pm25Value,
                      pm10Value: marker.pm10Value,
                      o3Value: marker.o3Value,
                      dataTime: marker.dataTime
                  });
                }}
                onMouseOver={() =>
                  setHoveredMarker({
                    lat,
                    lng,
                    stationName: marker.stationName,
                    addr:marker.addr,
                    pm25Value: marker.pm25Value,
                    pm10Value: marker.pm10Value,
                    o3Value: marker.o3Value,
                    dataTime: marker.dataTime
                  })
                }
                onMouseOut={() => setHoveredMarker(null)}
              />
            );
          })}
          </MarkerClusterer>
          
        </GoogleMap>
      ) : (
        <div className="loading-box">
          <div className="loading-center">
            <MoonLoader
              color="#387be6"
              cssOverride={{
                margin: "0px auto",
              }}
              loading
              size={61}
              speedMultiplier={1}
            />
            <p className="loading-info">데이터를 불러오는 중입니다.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default EnvMap;