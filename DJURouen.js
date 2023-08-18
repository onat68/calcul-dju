const fs = require("fs");
const csvParser = require('csv-parser')
let dataStation = []


fs.readFile("./dataStations/dataRouen.csv", "utf-8", (err, data) => {
  if (err) console.log(err);
  else console.log("Démarré");
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
              date: date,
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

    console.log('Moyenne décennie : ' , calculDJUDecennie(2011,2012))
}

const extractWinterOf = (startYear,endYear) => {
  let arrayOfWinter = new Array()

  let startDate = new Date(`${startYear}-10-01`)
  let endDate = new Date(`${endYear}-05-31`)


  for (date in sortedTemperature){
    let dateToCompare = new Date(date)
    if (startDate <= dateToCompare && dateToCompare <= endDate){
      arrayOfWinter.push(sortedTemperature[date])
      // console.log(arrayOfWinter)
    }
  }
  return arrayOfWinter

}

const calculDJUMoyen = (arrayOfDates) => {
  let totalDJU = 0
  let totalDays = 0
  for(date in arrayOfDates){
      totalDays += 1
      totalDJU += arrayOfDates[date].DJU
  }

  let moyenneDJU = totalDJU / totalDays
  // console.log(moyenneDJU)
  return moyenneDJU
}

const calculDJUDecennie = (startDate,endDate) => {

let DJUMoyenDecennie = 0

  for (let i=0;i<10;i++){
    console.log('Hiver ' + startDate + '/'+ endDate, calculDJUMoyen(extractWinterOf(startDate,endDate)))
    DJUMoyenDecennie += calculDJUMoyen(extractWinterOf(startDate,endDate))
    startDate = parseInt(startDate)+1
    endDate = parseInt(endDate)+1
  }

DJUMoyenDecennie = DJUMoyenDecennie / 10

return DJUMoyenDecennie

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
