import React, { useEffect, useState, useRef } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindow,
  //MarkerClusterer
} from "@react-google-maps/api";
import koreaGeoJson from '../data/korea.json'

import {getWeatherAPITime, getOneHourLater} from '../utils/dateUtil';

import LoadingBox from '../components/Common/LoadingBox';
import blue from '../assets/images/env/icon_blue.png';

//구글맵 스타일
const myStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

// 대한민국 중심 좌표 및 날씨 호출 좌표
const koreaInfoArr = [
  {
    korName: "서울특별시",
    nx: 60,
    ny: 27,
    lat: 37.5665,  // 서울 중심
    lng: 126.9780,
  },
  {
    korName: "부산광역시",
    nx: 98,
    ny: 76,
    lat: 35.1796,  // 부산 중심
    lng: 129.0756,
  },
  {
    korName: "대구광역시",
    nx: 89,
    ny: 90,
    lat: 35.8714,  // 대구 중심
    lng: 128.6014,
  },
  {
    korName: "인천광역시",
    nx: 55,
    ny: 124,
    lat: 37.4563,  // 인천 중심
    lng: 126.7052,
  },
  {
    korName: "광주광역시",
    nx: 58,
    ny: 74,
    lat: 35.1595,  // 광주 중심
    lng: 126.8526,
  },
  {
    korName: "대전광역시",
    nx: 67,
    ny: 100,
    lat: 36.3504,  // 대전 중심
    lng: 127.3845,
  },
  {
    korName: "울산광역시",
    nx: 102,
    ny: 84,
    lat: 35.5384,  // 울산 중심
    lng: 129.3114,
  },
  {
    korName: "세종특별자치시",
    nx: 66,
    ny: 103,
    lat: 36.4875,  // 세종 중심
    lng: 127.2817,
  },
  {
    korName: "경기도",
    nx: 60,
    ny: 120,
    lat: 37.4138,  // 경기도 중심
    lng: 127.5183,
  },
  {
    korName: "충청북도",
    nx: 69,
    ny: 107,
    lat: 36.6359,  // 충청북도 중심
    lng: 127.4914,
  },
  {
    korName: "충청남도",
    nx: 68,
    ny: 100,
    lat: 36.5184,  // 충청남도 중심
    lng: 126.8005,
  },
  {
    korName: "전라북도",
    nx: 63,
    ny: 89,
    lat: 35.7175,  // 전라북도 중심
    lng: 127.153,
  },
  {
    korName: "전라남도",
    nx: 51,
    ny: 67,
    lat: 34.8679,  // 전라남도 중심
    lng: 126.9910,
  },
  {
    korName: "경상북도",
    nx: 87,
    ny: 106,
    lat: 36.5684,  // 경상북도 중심
    lng: 128.7290,
  },
  {
    korName: "경상남도",
    nx: 91,
    ny: 77,
    lat: 35.2383,  // 경상남도 중심
    lng: 128.6927,
  },
  {
    korName: "제주특별자치도",
    nx: 52,
    ny: 38,
    lat: 33.4996,  // 제주도 중심
    lng: 126.5312,
  },
  {
    korName: "강원특별자치도",
    nx: 73,
    ny: 134,
    lat: 37.8228,  // 강원도 중심
    lng: 128.1555,
  },
];


const fetchAllRegionData = async () => {
  //api 요청 시간 
  const [apiDate, apiTime] = getWeatherAPITime();
  console.log(apiDate, apiTime);
  console.log(typeof apiDate)
  const [latedDate, latedTime] = getOneHourLater(apiDate, apiTime);



  const weatherInfoList = []; // 각 지역별 날씨 정보를 저장할 배열

  await Promise.all(
    koreaInfoArr.map(async (koreaInfo) => {
      const weatherRes = await fetch(
        `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${process.env.REACT_APP_OPEN_API_KEY}&numOfRows=100&pageNo=1&dataType=JSON&base_date=${apiDate}&base_time=${apiTime}&nx=${koreaInfo.nx}&ny=${koreaInfo.ny}`
      )

      if (!weatherRes.ok) {
        console.error(`지역별 날씨 데이터 호출 실패 : ${koreaInfo}`);
      }

      const weatherData = await weatherRes.json();
      

      
      const parsingData = weatherData.response.body.items.item;
      const weatherInfo = { region: koreaInfo.korName, lat: koreaInfo.lat, lng: koreaInfo.lng }; // 지역 정보를 포함

      // 카테고리와 fcstValue 매핑을 위한 객체
      const categoryMapping = {
        LGT: "lgt",
        PTY: "pty",
        RN1: "pn1",
        SKY: "sky",
        T1H: "t1h",
        REH: "reh",
        UUU: "uuu",
        VVV: "vvv",
        VEC: "vec",
        WSD: "wsd"
      };

      //빈값 넣기
      Object.keys(categoryMapping).forEach((key) => {
        weatherInfo[categoryMapping[key]] = null;
      })
                  
      parsingData.forEach((item) => {
        if(item.fcstDate === latedDate && item.fcstTime == latedTime) {

            // 카테고리에 따른 값을 weatherInfo에 추가
            Object.keys(categoryMapping).forEach((key) => {

              if (item.category == key) {
                weatherInfo[categoryMapping[key]] = item.fcstValue;
              }
            });

        }
      })
      weatherInfoList.push(weatherInfo);


    })
  )
  return weatherInfoList; // 최종 날씨 정보 리스트 반환
}

// geojson 폴리곤 스타일 설정 함수
const getPolygonStyle = (isHovered) => ({
  fillColor: isHovered ? '#4682B4' : 'blue',
  strokeColor: 'white',
  strokeWeight: isHovered ? 2 : 1,
  fillOpacity: isHovered ? 0.6 : 0.2,
});




const WeatherPage = () => {
  const [map, setMap] = useState(null);
  const hoveredPolygonRef = useRef(null); // useRef로 hoveredPolygon 저
  const mapCenter = useRef({ lat: 36.2038, lng: 126.8309}); 
  const [markers, setMarkers] = useState([]); // 여러 마커 저장

  const [hoveredPolygon, setHoveredPolygon] = useState(null); 


  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  useEffect(()=> {

    const fetchData = async () => {
        const weatherDataList = await fetchAllRegionData();
        console.log(weatherDataList)
        setMarkers(weatherDataList);
    }

    fetchData();


    if(map) {

      // 이전 GeoJSON 데이터 제거
      map.data.forEach((feature) => {
        map.data.remove(feature);
      });

      // 새로운 마커 배열 초기화
      const newMarkers = [];

   
      //console.log(weatherData)
      koreaGeoJson.features.forEach(feature => {
        map.data.addGeoJson(feature); // GeoJSON 파일을 맵에 추가
        koreaInfoArr.forEach((item)=> {
          if(item.korName ==feature.properties.CTP_KOR_NM) {
            //console.log(item)


            newMarkers.push(item)
          }
        })
      });
      //setMarkers(newMarkers);


      // 기본 스타일 설정
      map.data.setStyle((feature) => {
        const isHovered = feature.properties && feature.properties.CTP_KOR_NM === hoveredPolygon;
        return getPolygonStyle(isHovered);
      });

      // 폴리곤 마우스 오버아웃 이벤트 설정
      map.data.addListener('mouseover', (event) => {
        highlightPolygon(map, event.feature.Fg.CTP_KOR_NM);
      });
      // 폴리곤 마웃 아웃 이벤트 설정
      map.data.addListener('mouseout', () => {
        resetPolygonStyle(map);
      });
    
    }
  }, [map])




  // 폴리곤 강조 함수
  const highlightPolygon = (map, polygonName) => {
    let featureToHighlight = null;
    if(  map.data){
    map.data.forEach((feature) => {
      if (feature.getProperty('CTP_KOR_NM') === polygonName) {
        featureToHighlight = feature;
      }
    });

    if (featureToHighlight) {
      map.data.overrideStyle(featureToHighlight, {
        fillColor: '#4682B4',
        strokeColor: 'white',
        strokeWeight: 2,
        fillOpacity: 0.6,
      });
    }
    }
  };

  // 폴리곤 강조 해제 함수
  const resetPolygonStyle = (map) => {
    map.data.forEach((feature) => {
      if (feature.getProperty('CTP_KOR_NM')) {
        map.data.revertStyle();
      }
    });
  };

  return (
      <div className="weather-page">
        {isLoaded ?(
          <>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={mapCenter.current}
              onLoad={(mapInstance) => setMap(mapInstance)}
              zoom={7}
              options={{
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                disableDefaultUI: false,
                styles: myStyles,
              }}
            >
              {
                markers.map((marker, index) => {
                  return (
                    <InfoWindow
                      key={index}
                      position={{lat:marker.lat, lng:marker.lng}}
                      options={{ pixelOffset: new window.google.maps.Size(0, 10) }} // 마커 위치 수정
                    >
                      <div 
                        onMouseOver={(event) => {
                          highlightPolygon(map, marker.korName); // 폴리곤 강조
                        
                        }}
                        onMouseOut={() => {
                          resetPolygonStyle(map); // 폴리곤 강조 해제
                        }}
                        style={{
                        minWidth: "90px",
                        padding: '5px 10px',
                        textAlign: 'center',
                      }}>
                        <h3 style={{
                          marginBottom: '5px',
                          fontSize:'13px',
                          fontFamily: 'GOSEONGGEUMGANGNURI',
                        }}>{marker.region}</h3>

                        <img src={blue} alt="weather icon" style={{ width: '15px', height: '15px', marginBottom:'5px'}} />
                        <div 
                          className="temperature"
                          style={{
                            fontSize:'12px'
                          }}
                        >{`${marker.t1h}°C / ${marker.reh}%`}</div> {/* 유동적인 온도 값 */}
                      </div>
                    </InfoWindow>
                  )
                })
              }
            </GoogleMap>
          </>
        ): (
          <LoadingBox 
            height={'100%'}
            title ='데이터를 불러오는 중입니다.'
          />
        )}
      </div>
  );
};

export default WeatherPage;