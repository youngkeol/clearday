# t 없이 맑은 날

### 📑목차<br>
- [🌤 ️t 없이 맑은 날 소개](#user-content--️t-없이-맑은-날-소개)<br>
- [🛠 사용 기술](#user-content-️-사용기술)<br>
- [👍🏻 후기](#user-content--후기)<br>

<br>
<br>
<br>

### 🌤 ️t 없이 맑은 날 소개
t 없이 맑은 날은 날씨와 대기환경(미세먼지)를 표출해주는 웹 애플리케이션입니다.<br>
React.js를 사용하여 개발되었으며, 공공데이터 포털 API(기상청 날씨, 에어코리아 미세먼지)를 사용하여 데이터를 불러오고, 구글 맵을 통해 화면에 표출했습니다.


1. 날씨 현황 화면
![1_날씨 화면](https://github.com/youngkeol/clearday/blob/main/readme_images/cleanday01.png)<br>

2. 대기환경 현황 화면
![2_대기환경 화면](https://github.com/youngkeol/clearday/blob/main/readme_images/cleanday02.png)<br>
<br>
<br>
<br>





### 🛠️ 사용기술
1. Frontend: React
2. 상태 관리: Context API
3. 기타 기능: Google Maps, ApexCharts
4. 데이터: 공공데이터 포털(기상청 날씨, 에어코리아 미세먼지)
<br>
<br>
<br>


### 👍🏻 후기
이 프로젝트는 React.js 공부 목적으로 가볍게 시작한 프로젝트였으며, 공공데이터 포털 API와 구글 맵을 활용해 데이터를 화면에 표출하는 방식을 구현했습니다.
처음에는 Promise를 사용해 데이터를 호출했으나, 지역별로 데이터를 호출해야 해서 초기 데이터 로딩 시간이 길어지는 문제가 발생했습니다. 이를 해결하기 위해 Promise.all을 사용하여 여러 API 요청을 병렬로 처리하게 했습니다.

프로젝트를 진행하면서 PC 화면만을 고려하여 만들었지만, 반응형 웹으로 전환한 후 PC 화면에서의 호버 기능이 모바일 화면에서는 클릭으로 동작하게 되어, 모바일 화면에서 조금 이상한 느낌이 들었습니다.
향후에는 반응형 웹을 좀 더 세심하게 고려하고, 호버 기능을 모바일에서도 자연스럽게 구현할 수 있도록 개선할 예정입니다.
<br>
<br>
<br>
