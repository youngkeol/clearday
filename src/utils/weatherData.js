import weatherIcon01 from '../assets/images/weather/weather01.png';
import weatherIcon02 from '../assets/images/weather/weather02.png';
import weatherIcon03 from '../assets/images/weather/weather03.png';
import weatherIcon04 from '../assets/images/weather/weather04.png';
import weatherIcon05 from '../assets/images/weather/weather05.png';
import weatherIcon06 from '../assets/images/weather/weather06.png';
import weatherIcon07 from '../assets/images/weather/weather07.png';


// 대한민국 중심 좌표 및 날씨 호출 좌표
export const koreaInfoArr = [
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
    korName: "전북특별자치도",
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


// 날씨 api 카테고리와 fcstValue 매핑을 위한 객체
export const categoryMapping = {
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



//날씨 아이콘 이미지 반환
/*
하늘 상태(SKY) - 맑음(1), 구름많음(3), 흐림(4)
강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7) 
낙뇌(LET)  

1. let 값이 존재하면 낙뇌 반환
2. 강수 형태가 있으면 비, 눈 반환
3. 강수형태가 0 이면 하늘 상태, 맑음, 구름 많음, 흐림 반환
*/

  export const getWeatherIcon = (data) => {
    try {
      // 대소문자 조합을 모두 확인하여 값을 가져옵니다.
      const lgt = data.lgt || data.LGT;
      const pty = data.pty || data.PTY;
      const sky = data.sky || data.SKY;
  
      if (lgt && lgt !== '0') {
        return weatherIcon04;
      }
  
      if (pty === '1' || pty === '2' || pty === '5' || pty === '6') {
        return weatherIcon02;
      }
  
      if (pty === '3' || pty === '7') {
        return weatherIcon05;
      }
  
      if (sky === '1') {
        return weatherIcon01;
      }
  
      if (sky === '3') {
        return weatherIcon06;
      }
  
      if (sky === '4') {
        return weatherIcon03;
      }
  
      return weatherIcon07;
    } catch (error) {
      return weatherIcon07;
    }
  };



  export const formatDate = (dateString) => {
    if (dateString.length !== 8) {
      throw new Error("Invalid date format. Expected format: YYYYMMDD.");
    }
    
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    
    return `${year}.${month}.${day}`;
  };
  

  export const formatTime = (timeString) => {
    if (timeString.length !== 4) {
      throw new Error("Invalid time format. Expected format: HHMM.");
    }
    
    const hour = timeString.slice(0, 2); // 시간만 추출
    return hour; // 문자열 그대로 반환
  };
