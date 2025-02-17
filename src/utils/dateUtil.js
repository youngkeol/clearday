export function getHourString(dateString) {
  // 문자열을 Date 객체로 변환
  const date = new Date(dateString);

  // 시간을 추출하여 '시' 형식으로 변환
  const hours = String(date.getHours()).padStart(2, "0");

  return `${hours}시`;
}

export function getWeatherAPITime() {
  //1. 현재 시간
  const now = new Date();

  //2. 기준 시간 (현재 시간의 30분 전)
  const referenceTime = new Date(now.getTime() - 30 * 60 * 1000);

  // 3. 기준 날짜를 YYYYMMDD 형식으로 변환
  const year = referenceTime.getFullYear();
  const month = String(referenceTime.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(referenceTime.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  const hour = String(referenceTime.getHours()).padStart(2, '0');
  const hourStr = `${hour}00`;
  // 배열로 결과 반환
  return [dateStr, hourStr];
}


export function getOneHourLater(dateInput, timeInput) {
    // dateInput은 YYYYMMDD 형식, timeInput은 HHMM 형식으로 받음
    const year = parseInt(dateInput.slice(0, 4), 10);
    const month = parseInt(dateInput.slice(4, 6), 10) - 1; // 자바스크립트의 월은 0부터 시작하므로 -1
    const day = parseInt(dateInput.slice(6, 8), 10);
    
    const hour = parseInt(timeInput.slice(0, 2), 10);
    const minute = parseInt(timeInput.slice(2, 4), 10);
  
    // 주어진 날짜와 시간으로 Date 객체 생성
    const inputDate = new Date(year, month, day, hour, minute);
  
    // 1시간을 더한 후의 시간을 계산
    const oneHourLater = new Date(inputDate.getTime() + 60 * 60 * 1000);
  
    // 1시간 후의 날짜를 YYYYMMDD 형식으로 변환
    const newYear = oneHourLater.getFullYear();
    const newMonth = String(oneHourLater.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const newDay = String(oneHourLater.getDate()).padStart(2, '0');
    const newDateStr = `${newYear}${newMonth}${newDay}`;
  
    // 1시간 후의 시간을 HHMM 형식으로 변환
    const newHour = String(oneHourLater.getHours()).padStart(2, '0');
    const newMinute = String(oneHourLater.getMinutes()).padStart(2, '0');
    const newTimeStr = `${newHour}${newMinute}`;
  
    // 배열로 반환
    return [newDateStr, newTimeStr];
}