import { useReducer, createContext } from "react";

// 1.초기 상태 정의
const initialState = {
  map: null,
  sideBar: false,
  selectedMarker: null,
};

//2. 리듀서 함수 정의
const envReducer = (state, action) => {
  switch (action.type) {
    case "SET_MAP":
      return { ...state, map: action.payload }; // map 객체 저장
    case "selectMarker":
      return { ...state, sideBar: true, selectedMarker: action.payload };
    case "deselectMarker":
      return { ...state, sideBar: false, selectedMarker: null };
    case "search":
      return { ...state, sideBar: true, selectedMarker: action.payload };
    default:
      return state;
  }
};

//3. .새로운 Context를 생성
const EnvContext = createContext();

//4. Context와 useReducer를 결합한 Provider 컴포넌트
export const EnvProvider = ({ children }) => {
  const [state, dispatch] = useReducer(envReducer, initialState);

  // 마커가 선택될 때 지도 이동 및 줌 조정
  /*
  useEffect(() => {
    if (state.map && state.selectedMarker) {
      //const { lat, lng } = state.selectedMarker;
      //state.map.panTo({ lat, lng });
      //state.map.setZoom(13);
    }
  }, [state.map, state.selectedMarker]); // map 또는 selectedMarker 변경 시 수행
  */

  return (
    <EnvContext.Provider value={{ state, dispatch }}>
      {children}
    </EnvContext.Provider>
  );
};

export default EnvContext;
