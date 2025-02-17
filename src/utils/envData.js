
import envIcon01 from '../assets/images/env/icon_blue.png';
import envIcon02 from '../assets/images/env/icon_green.png';
import envIcon03 from '../assets/images/env/icon_yellow.png';
import envIcon04 from '../assets/images/env/icon_red.png';
import envIcon05 from '../assets/images/env/icon_gray.png';

// 측정값과 색상 범위 정의
export const envColorRanges = {
  pm25: [
    { limit: 16, color: "blue", rgb: "#609fea", icon: envIcon01, status:"좋음"}, // blue
    { limit: 36, color: "green", rgb: "#3ed388", icon: envIcon02, status:"보통"}, // green
    { limit: 76, color: "yellow", rgb: "#f4ba53", icon: envIcon03, status:"나쁨"}, // yellow
    { limit: Infinity, color: "red", rgb: "#f2574d", icon: envIcon04, status:"매우좋음"}, // red
  ],
  pm10: [
    { limit: 31, color: "blue", rgb: "#609fea", icon: envIcon01, status:"좋음" }, // blue
    { limit: 81, color: "green", rgb: "#3ed388", icon: envIcon02, status:"보통" }, // green
    { limit: 151, color: "yellow", rgb: "#f4ba53", icon: envIcon03, status:"나쁨" }, // yellow
    { limit: Infinity, color: "red", rgb: "#f2574d", icon: envIcon04, status:"매우좋음" }, // red
  ], 
  o3: [
    { limit: 0.031, color: "blue", rgb: "#609fea", icon: envIcon01, status:"좋음" }, // blue
    { limit: 0.091, color: "green", rgb: "#3ed388", icon: envIcon02, status:"보통" }, // green
    { limit: 0.151, color: "yellow", rgb: "#f4ba53", icon: envIcon03, status:"나쁨" }, // yellow
    { limit: Infinity, color: "red", rgb: "#f2574d", icon: envIcon04, status:"매우좋음" }, // red
  ],
};

// 색상 결정 함수
export const getEnvColor = (value, type, option) => {
  const ranges = envColorRanges[type];


  if (!value || value === "-") {
    const defaultValues = {
      color: "gray",
      rgb: "#7e818d",
      icon: envIcon05, // 기본 아이콘 설정
      status: "데이터 없음", // 기본 상태 메시지 설정
    };
    return option ? defaultValues[option] : defaultValues; // option
  }

  for (const range of ranges) {
    if (value < range.limit) {
      return option ? range[option] : range; // Return 'color' or 'rgb' based on the option
    }
  }

  // 범위에 맞는 값이 없으면 마지막 범위의 값을 반환
  return option ? ranges[ranges.length - 1][option] : ranges[ranges.length - 1];
};