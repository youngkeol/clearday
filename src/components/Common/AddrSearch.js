import React, { useState, useEffect, useRef, useContext } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { convertCoordinates } from "../../utils/convertUtil";
import EnvContext from "../../hooks/EnvReducer";

const AddrSearch = () => {
  const { state, dispatch } = useContext(EnvContext);
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const places = useMapsLibrary("places");
  const [search, setSearch] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
      componentRestrictions: { country: "KR" }, // 한국만 지정
    };

    const autocompleteInstance = new places.Autocomplete(
      inputRef.current,
      options
    );
    //console.log(autocompleteInstance)
    setPlaceAutocomplete(autocompleteInstance);


    // 선택된 장소 정보 가져오기
    autocompleteInstance.addListener("place_changed", () => {
      const place = autocompleteInstance.getPlace();
      if (place && place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSearch(place.formatted_address); // 입력 필드 업데이트
        sensorAPICall(place.formatted_address, lat, lng); // API 호출
      }
    });

  }, [places]);

  const inputChangeHandler = (e) => {
    e.preventDefault();
    setSearch(e.target.value); // 입력 값을 search 상태로 업데이트
    const place = placeAutocomplete.getPlace();
    if (!place) {
      // 사용자가 주소를 선택하지 않았거나, 자동완성 결과가 없는 경우
      return;
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const place = placeAutocomplete.getPlace();
    const service = new places.AutocompleteService();

    setSearch((prevSearch) => {
      return inputRef.current.value; // 새로운 값 반환
    });
    
    service.getPlacePredictions(
      { input: inputRef.current.value },
      (predictions, status) => {
        if (status === places.PlacesServiceStatus.OK && predictions) {
          setSearch(predictions[0].description);
          const placeId = predictions[0].place_id;
          const service = new places.PlacesService(inputRef.current);

          service.getDetails({ placeId }, (place, status) => {
            if (status === places.PlacesServiceStatus.OK) {
              const data = sensorAPICall(
                place.formatted_address, // 주소
                place.geometry.location.lat(),  // 위도
                place.geometry.location.lng() // 경도
              );
            }
          });
        } else {
          alert("주소호출 실패했습니다. 잠시후에 다시 시도해주세요.");
          //setAutocompleteResults([]); // 예외 처리
        }
      }
    );
  };

  const sensorAPICall = async (address, lat, lng) => {
    
    try {
      //위도 경도 -> TM 좌표 변환
      const { x, y } = await convertCoordinates(lat, lng, `${process.env.REACT_APP_KAKAO_REST_API_KEY}`);
      
      //근접 측정소 호출
      const sensorRes = await fetch(
        `http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?serviceKey=${process.env.REACT_APP_OPEN_API_KEY}&returnType=json&tmX=${x}&tmY=${y}`
      );
      const sensorData = await sensorRes.json();
   
      const { addr, stationName } = sensorData.response.body.items[0];


      const curEnvUrl =`${process.env.REACT_APP_NATURE_DATA_URL}/env/getCurrentSensorEnv?station_name=${stationName}`;
      const curEnvRes = await fetch(curEnvUrl, {
        method : 'GET',
        headers : {
          'Content-Type': 'application/json',
          'servicekey': `${process.env.REACT_APP_NATURE_DATA_API_KEY}`
        }
      });
      if(!curEnvRes.ok){
        console.error(`현재 측정소 데이터 호출 실패 : ${curEnvUrl}`);
        throw new Error();
      }

      const curEnvData = await curEnvRes.json();
      const parsingData = await curEnvData.response.body.items[0];

      
      dispatch({
        type: "selectMarker", //검색 시 해당 마커 선택됨
        payload: { ...parsingData, stationName, addr, lat, lng },
      });
      return curEnvData;
    } catch(error) {
      alert("검색에 실패했습니다.\n만약 해외 주소 검색 시 미세먼지 측정기가 검색되지 않습니다.")
      //throw("근접 측성소 호출 및 데이터 호출 실패: ${error}" )
    }
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          id="autocomplete"
          className="search-input"
          placeholder="주소 입력 시 가장 가까운 측정기로 검색됩니다."
          autoComplete="off"
          value={search}
          onChange={inputChangeHandler}
          ref={inputRef}
        />
      </form>
    </>
  );
};

export default AddrSearch;
