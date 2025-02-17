import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import LoadingBox from "../Common/LoadingBox";
import { getHourString } from "../../utils/dateUtil";
import classes from "./EnvChart.module.css";


const EnvChart = ({station_name}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [series, setSeies] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(()=>{
    const fetchData = async () => {
      try {
        //데이터 호출
        const url =`${process.env.REACT_APP_NATURE_DATA_URL}/env/getPastSensorEnvList?station_name=${station_name}&hour=04`;
        const pastSensorRes = await fetch(url, {
          method : 'GET',
          headers : {
            'Content-Type': 'application/json',
            'servicekey': `${process.env.REACT_APP_NATURE_DATA_API_KEY}`
          }
        });
        if(!pastSensorRes.ok){
          console.error(`측정기 데이터 호출 실패 실패 : ${url}`);
          throw new Error();
        }

        const pastSensorData = await pastSensorRes.json();
        const parsingData = await pastSensorData.response.body.items;
        const pm25DataArr = [];
        const pm10DataArr = [];
        const dateDataArr = [];

        for(let item of parsingData) {
          pm25DataArr.push(item.pm25);
          pm10DataArr.push(item.pm10);
          dateDataArr.push(getHourString(item.data_time));
        }


        // 데이터가 성공적으로 로드된 후 상태 업데이트
        setSeies([
          { name: "PM2.5", data: pm25DataArr },
          { name: "PM10", data: pm10DataArr }
        ]);
        setCategories(dateDataArr);
        setIsLoaded(true); // 데이터가 있으면 호출 성공(데이터 있음, 빈값 데이터) -> 로딩 완료를 true로 설정
      } catch(error) {
        setIsLoaded(false); // 데이터가 없으면 호출 실패 -> 로딩 완료를 false로 설정
      }
    }

    fetchData();
  }, [station_name]);

  const options = {
    chart: {
      height: 240,
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      fontFamily: "TTTogether, Arial, sans-serif",
    },
    dataLabels: {
      enabled: false,
    },
    //colors: [ "#21c197", "#667cd6"],
    stroke: {
      curve: "smooth",
    },
    grid: {
      borderColor: "#eee",
      row: {
        colors: undefined,
        opacity: 0.5,
      },
      column: {
        colors: undefined,
        opacity: 0.5,
      },
      padding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 10,
      },
    },
    markers: {
      size: 5,
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        style: {
          fontSize: "14px",
          fontFamily: "Gothic A1, Arial, sans-serif",
          fontWeight: 500,
        },
      },
    },
    noData: {
      text: '데이터 항목이 충분하지 않습니다.',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: '13px',
        fontFamily: 'Helvetica, Arial, sans-serif'
      }
    }
  };


  if(!isLoaded) {
    return(
      <LoadingBox 
        height={240}
        title ='데이터를 불러오는 중입니다.'
      />
    )
  }

  return (
    <>
      { isLoaded &&
        <div className={classes["env-chart-box"]}>
        <div id="chart">
          <ApexCharts
            options={options}
            series={series}
            type="line"
            height={240}
          />
        </div>
      </div>
      }
    </>
  );
};

export default EnvChart;
