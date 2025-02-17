// src/routes/router.js
import { createBrowserRouter } from "react-router-dom";
import LayoutPage from "../pages/LayoutPage";
import WeatherPage from "../pages/WeatherPage";
import EnvPage from "../pages/EnvPage";
import ErrorPage from "../pages/ErrorPage";
import { EnvProvider } from "../hooks/EnvReducer";
import { WeatherProvider } from "../hooks/WeatherReducer";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPage />,
    errorElement: <ErrorPage />,
    children: [
      { index:true,  element: <WeatherProvider><WeatherPage /></WeatherProvider> },
      { path: "environment", element: <EnvProvider><EnvPage/></EnvProvider> },
    ],
  },
]);

export default router;
