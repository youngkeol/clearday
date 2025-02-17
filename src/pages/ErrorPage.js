import React from 'react';
import classes from './ErrorPage.module.css';

const ErrorPage = () => {
  return (
    <div className={classes["not-found-box"] }>
       <h2  className={classes["tit"] }>페이지를 찾을 수 없습니다.</h2>
       <p  className={classes["txt1"] }>페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.</p>
       <p  className={classes["txt2"] }>입력하신 주소가 정확한지 다시 한번 확인해주세요.</p>
       <a href="/"  className={classes["link"] }>T없이맑은날 홈 화면 이동</a>
    </div>
  );
};

export default ErrorPage;