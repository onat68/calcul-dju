let stations = new Array();
let station = "";
let resultatElement = document.getElementById("resultat")!;
let stationElement = document.getElementById("station")!;
let postalField = document.getElementById("postal-field")!;
let info = document.getElementById("infos")!;
let input = document.getElementById("input")!;
let reloadButton = document.getElementsByClassName("reload-button")[0]!;

let seuilRef=999

class dayTemperatures {
  date: string;
  tmin: number;
  tmax: number;
  DJU: number;

  public constructor(date: string, tmin: number, tmax: number, DJU: number){
    this.date = date
    this.tmin = tmin
    this.tmax = tmax
    this.DJU = DJU
  }
} 

class resultEntry {
  date?: string;
  temperature: number
  
  public constructor(element: any){
    if(element.date!=undefined){
      this.date = element.date
    }
    this.temperature = parseFloat(element.temperature)
  }
}

interface arrayOfResults {
  [key: string]: dayTemperatures
  // length: number = 0

  // data: {[key: string]: any} = {} 
  // length: number = 0
}

// let sortedTemperature = new arrayOfResults()
let sortedTemperature: arrayOfResults
// let sortedTemperature: dayTemperatures[]

const calculDJU = (tmin: number, tmax: number) => {
    let moyenneTemp = (tmin + tmax) / 2;
    if(seuilRef==999){
      return seuilRef
    }
    if (moyenneTemp > seuilRef) {
      return 0;
    } else {
      return seuilRef - moyenneTemp;
    }
  };
  
  const extractTemperatures = (result: []) => {
    result.forEach((element) => {
      let dayEntry = new resultEntry(element)
      if(dayEntry.date!=undefined){
        const date = dayEntry.date.split("T")[0];  
        if (
          !sortedTemperature[date] &&
          dayEntry.temperature &&
          date.split("-")[0] != "2023"
        ) {
          sortedTemperature[date] = new dayTemperatures(date,dayEntry.temperature, dayEntry.temperature, calculDJU(
            dayEntry.temperature,
            dayEntry.temperature
          ))
        } else if (dayEntry.temperature && date.split("-")[0] != "2023") {
          if ((dayEntry.temperature) < sortedTemperature[date].tmin) {
            sortedTemperature[date].tmin = (dayEntry.temperature);
            sortedTemperature[date].DJU = calculDJU(
              sortedTemperature[date].tmin,
              sortedTemperature[date].tmax
            );
          }
          if (dayEntry.temperature > sortedTemperature[date].tmax) {
            sortedTemperature[date].tmax = dayEntry.temperature;
          }
        }
      }
  })
  }
  
  const extractWinterOf = (startYear: number, endYear: number) => {
    let arrayOfWinter = [];
  
    let startDate = new Date(`${startYear}-10-01`);
    let endDate = new Date(`${endYear}-05-31`);
  
    for (const date in sortedTemperature) {
      let dateToCompare = new Date(date);
      if (startDate <= dateToCompare && dateToCompare <= endDate) {
        arrayOfWinter.push(sortedTemperature[date]);
      }
    }
    return arrayOfWinter;
  };
  
  const calculDJUMoyen = (arrayOfDates: dayTemperatures[]) => {
    let totalDJU = 0;
    for (const date in arrayOfDates) {
      totalDJU += arrayOfDates[date].DJU;
    }
    return totalDJU / Object.keys(sortedTemperature).length;
  };
  
  const calculDJUDecennie = (start: number, end: number) => {
    resultatElement.innerHTML = ""
    let DJUMoyenDecennie = 0;
    
    let startDate: number = start - 10;
    let endDate: number = end - 10;
    
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