const fs = require("fs");
const csvParser = require('csv-parser')
let dataStation = []


fs.readFile("./dataStations/dataRouen.csv", "utf-8", (err, data) => {
  if (err) console.log(err);
  else console.log("all good");
});

fs.createReadStream("./dataStations/dataRouen.csv")
  .pipe(csvParser({ separator: ';' }))
  .on("data", (data) => {
    dataStation.push(data)
})
.on("end", () => {
    extractTemperatures(dataStation);
});

let sortedTemperature = []
const extractTemperatures = (result) => {

    result.forEach(element => {
        const date = element.date.split('T')[0];


        if (!sortedTemperature[date] && element.temperature && date.split('-')[0]!='2023') {
            sortedTemperature[date] = {
              tmin: parseFloat(element.temperature),
              tmax: parseFloat(element.temperature),
              DJU: calculDJU(parseFloat(element.temperature),parseFloat(element.temperature))
            };
        } else if (element.temperature && date.split('-')[0]!='2023'){
            if (parseFloat(element.temperature) < sortedTemperature[date].tmin) {
              sortedTemperature[date].tmin = parseFloat(element.temperature)
              sortedTemperature[date].DJU = calculDJU(sortedTemperature[date].tmin,sortedTemperature[date].tmax)
            }
            if (parseFloat(element.temperature) > sortedTemperature[date].tmax) {
              sortedTemperature[date].tmax = parseFloat(element.temperature)
            }
        }
    });
    
    let totalDJU = 0
    let totalDays = 0
    for(date in sortedTemperature){
        totalDays += 1
        // console.log(sortedTemperature[date],date)
        totalDJU += sortedTemperature[date].DJU
    }

    let moyenneDJU = totalDJU / totalDays

    console.log(sortedTemperature)

    
}



let seuilRef = 18
const calculDJU = (tmin,tmax) => {
    let moyenneTemp = ( tmin + tmax ) / 2
    if ( moyenneTemp > seuilRef ) {
        return 0
    }
    else {
        return seuilRef - moyenneTemp
    }
}
