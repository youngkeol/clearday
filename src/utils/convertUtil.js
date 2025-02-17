//위도 경도 -> TM 좌표 변환(카카오 API)
export const convertCoordinates = async (latitude, longitude, kakaoKey) => {
  //https://dapi.kakao.com/v2/local/geo/transcoord.json?x=126.9083451&y=37.5580889&input_coord=WGS84&output_coord=TM 
  const url = `https://dapi.kakao.com/v2/local/geo/transcoord.json?x=${longitude}&y=${latitude}&input_coord=WGS84&output_coord=TM`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        //'Authorization': `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`, // API 키 포함
        'Authorization': `KakaoAK ${kakaoKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { x, y } = data.documents[0];
    return { x, y };
  } catch (error) {
    console.error('Error converting coordinates:', error);
    throw error;
  }
};