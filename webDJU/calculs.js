let sortedTemperature = [];

const calculDJU = (tmin, tmax) => {
    let moyenneTemp = (tmin + tmax) / 2;
    if (moyenneTemp > seuilRef) {
      return 0;
    } else {
      return seuilRef - moyenneTemp;
    }
  };
  
  const extractTemperatures = (result) => {
    result.forEach((element) => {
      if(element.date!=undefined){
        const date = element.date.split("T")[0];
  
        if (
          !sortedTemperature[date] &&
          element.temperature &&
          date.split("-")[0] != "2023"
        ) {
          sortedTemperature[date] = {
            date: date,
            tmin: parseFloat(element.temperature),
            tmax: parseFloat(element.temperature),
            DJU: calculDJU(
              parseFloat(element.temperature),
              parseFloat(element.temperature)
            ),
          };
        } else if (element.temperature && date.split("-")[0] != "2023") {
          if (parseFloat(element.temperature) < sortedTemperature[date].tmin) {
            sortedTemperature[date].tmin = parseFloat(element.temperature);
            sortedTemperature[date].DJU = calculDJU(
              sortedTemperature[date].tmin,
              sortedTemperature[date].tmax
            );
          }
          if (parseFloat(element.temperature) > sortedTemperature[date].tmax) {
            sortedTemperature[date].tmax = parseFloat(element.temperature);
          }
        }
      }
  })
  }
  
  const extractWinterOf = (startYear, endYear) => {
    let arrayOfWinter = new Array();
  
    let startDate = new Date(`${startYear}-10-01`);
    let endDate = new Date(`${endYear}-05-31`);
  
    for (date in sortedTemperature) {
      let dateToCompare = new Date(date);
      if (startDate <= dateToCompare && dateToCompare <= endDate) {
        arrayOfWinter.push(sortedTemperature[date]);
      }
    }
    return arrayOfWinter;
  };
  
  const calculDJUMoyen = (arrayOfDates) => {
    let totalDJU = 0;
    for (date in arrayOfDates) {
      totalDJU += arrayOfDates[date].DJU;
    }
    return totalDJU / arrayOfDates.length;
  };
  
  const calculDJUDecennie = (startDate, endDate) => {
    resultatElement.innerHTML = ""
    let DJUMoyenDecennie = 0;
    
    startDate = parseInt(startDate) - 10;
    endDate = parseInt(endDate) - 10;
    
    for (let i = 0; i < 10; i++) {
      let DJUMoyen = calculDJUMoyen(extractWinterOf(startDate + i, endDate + i))
      resultatElement.innerHTML += `<div class="text hiver"><p>Hiver ${startDate + i}/${endDate + i} : ${DJUMoyen}</p></div>`
      DJUMoyenDecennie += calculDJUMoyen(
        extractWinterOf(startDate + i, endDate + i)
      );
    }
    DJUMoyenDecennie = DJUMoyenDecennie / 10;
  
    return DJUMoyenDecennie;
  };
  
  const calculation = () => {
    let DJUMoyenLastWinter = calculDJUMoyen(extractWinterOf(2021, 2022));
    let DJUMoyenDecennie = calculDJUDecennie(2021, 2022);
    resultatElement.innerHTML += `<div class="text"><p>DJU Hiver 2021/2022 (01 Novembre au 31 Mai) sur la station de ${station} : ${DJUMoyenLastWinter}</p></div>`;
    resultatElement.innerHTML += `<div class="text"><p>Moyenne décennie : ${DJUMoyenDecennie}</p></div>`;
    resultatElement.innerHTML += `<div class="text"><p>Facteur de correction : ${
      DJUMoyenLastWinter / DJUMoyenDecennie
    }</p></div>`;
  };