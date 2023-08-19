const fs = require("fs");
const csvParser = require('csv-parser')
const prompt = require('prompt-sync')()
let station = ''
let dataStation = []

const findClosestStation = () => {
  let codePostal = prompt('>> Code postal : ')
  let stations = new Array ()
  const JSONCommunes = fs.readFileSync("./geoCommunes.json", "utf-8")
  const JSCommunes = JSON.parse(JSONCommunes)
  JSCommunes.forEach(element => {
    if(element.postal == codePostal.toString()){
      if(!stations.includes(element.closestStation)){
        stations.push(element.closestStation)
      }
      console.log(element)
    }
  })

  if(stations.length==0){
    console.log('Aucune ville trouvée')
    findClosestStation()
  }

  else{
    for (let i=0;i<stations.length;i++){
      console.log(i+1,': ',stations[i])
    }

    station = stations[prompt('>> Entrer le numéro de la station choisie : ')-1]
    console.log('Station choisie : ' + station)
}
  // console.log(JSCommunes)
}

findClosestStation()

let stationForCSV = station.split('-')[0].split('')[0].toUpperCase() + station.split('-')[0].slice(1)

let seuilRef = prompt('>> Définir le seuil de référence en °C : ')

fs.readFile(`./dataStations/data${stationForCSV}.csv`, "utf-8", (err, data) => {
  if (err) console.log(err);
  else console.log("Démarré");
});

fs.createReadStream(`./dataStations/data${stationForCSV}.csv`)
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

    DJUMoyenLastWinter = calculDJUMoyen(extractWinterOf(2021,2022))
    console.log(`DJU Hiver 2021/2022 (01 Novembre au 31 Mai) sur la station de ${station} : `, DJUMoyenLastWinter)
    console.log('Moyenne décennie : ' , calculDJUDecennie(2021,2022))
    console.log('Facteur de correction : ', DJUMoyenLastWinter/DJUMoyenDecennie)

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

let DJUMoyenDecennie = 0
const calculDJUDecennie = (startDate,endDate) => {

startDate = parseInt(startDate)-10
endDate = parseInt(endDate) - 10


  for (let i=0;i<10;i++){
    console.log('Hiver ' + startDate + '/'+ endDate, calculDJUMoyen(extractWinterOf(startDate,endDate)))
    DJUMoyenDecennie += calculDJUMoyen(extractWinterOf(startDate,endDate))
    startDate = parseInt(startDate)+1
    endDate = parseInt(endDate)+1
  }

DJUMoyenDecennie = DJUMoyenDecennie / 10

return DJUMoyenDecennie

}


const calculDJU = (tmin,tmax) => {
    let moyenneTemp = ( tmin + tmax ) / 2
    if ( moyenneTemp > seuilRef ) {
        return 0
    }
    else {
        return seuilRef - moyenneTemp
    }
}
