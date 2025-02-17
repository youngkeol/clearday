import { useReducer, createContext } from "react";

const initialState = {
  sideBar: false,
  selectedMarker: null,
};

const weatherReducer = (state, action) => {
  switch (action.type) {
    case "selectMarker":
      return { ...state, sideBar:true, selectedMarker: action.payload };
    case "deselectMarker":
      return { ...state, sideBar: false, selectedMarker: null };
    default :
      return state;
  }
};

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  return (
    <WeatherContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;
