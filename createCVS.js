const fs = require("fs");
const csvParser = require("csv-parser");
const prompt = require("prompt-sync")();
let stations = [];
let sortedTemperature = [];
let seuilRef = 18;

const findClosestStation = () => {
  const JSONCommunes = fs.readFileSync("./geoCommunes.json", "utf-8");
  const JSCommunes = JSON.parse(JSONCommunes);

  const JSONStations = fs.readFileSync("./geoStations.json", "utf8");
  const JSStations = JSON.parse(JSONStations);

  JSStations.forEach((element) => {
    // console.log(element.name)
    JSCommunes.forEach((commune) => {
      if (element.name == commune.closestStation) {
        element.status = "ok";
      }
    });
    if (element.status == "ok") {
      stations.push(element.name);
    }
  });

  JSStations.forEach((element) => {
    if (stations.includes(element.name)) {
        let station = element.name;
        let stationForCSV =
        station.split("-")[0].split("")[0].toUpperCase() +
        station.split("-")[0].slice(1);
        console.log(stationForCSV);
        
        if (fs.existsSync(`./dataStations/data${stationForCSV}.csv`)) { 
            let dataStation = [];


        
            fs.createReadStream(`./dataStations/data${stationForCSV}.csv`)
            .pipe(csvParser({ separator: ";" }))
            .on("data", (data) => {
                dataStation.push(data);
            })
            .on("end", () => {
                extractTemperatures(dataStation);
                console.log(element.name, seuilRef, calculation());
            });
        }
    }
  });
};

findClosestStation();

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
  });
};

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
  let DJUMoyenDecennie = 0;

  startDate = parseInt(startDate) - 10;
  endDate = parseInt(endDate) - 10;

  for (let i = 0; i < 10; i++) {
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
  return DJUMoyenLastWinter / DJUMoyenDecennie;
};
