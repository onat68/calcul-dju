// const fs = require("fs");
// const csvParser = require("csv-parser");
// const prompt = require("prompt-sync")();
let station = "";
let dataStation = [];
let sortedTemperature = [];

const resultatElement = document.getElementById("resultat");
const stationElement = document.getElementById("station");
const postalField = document.getElementById("postal-field");
const info = document.getElementById("infos");
const input = document.getElementById("input")

const findClosestStation = (codePostal) => {
  resultatElement.innerHTML = "";
  stationElement.innerHTML = "";
  let stations = new Array();
  console.log(codePostal);

  fetch("../geoCommunes.json")
    .then((response) => response.json())
    .then((JSCommunes) => {
      JSCommunes.forEach((element) => {
        if (element.postal == codePostal.toString()) {
          if (!stations.includes(element.closestStation)) {
            stations.push(element.closestStation);
          }
          resultatElement.innerHTML += `<p class="text">Commune : <strong>${element.name}  
        </strong>closestStation : <strong>${element.closestStation}<strong></p>`;
        }
      });

      if (stations.length == 0) {
        info.innerHTML = "Aucune ville trouvée";
      } else {
        input.innerHTML = `<div class="info" id="infos">SeuilRef</div>
                          <div class="form">
                          <input type="field" id="postal-field" />
                          </div>`;
        input.addEventListener('keypress', function(e) {
          if (e.key === "Enter" && stations.includes(station)) {
            seuilRef = postalField.value
            startCalcul()
          }
        })


        stationElement.innerHTML += `<div class="choice" id="firstChoice"><p class="choices">${stations[0]}</p></div>`;
        stationElement.innerHTML += `<div class="choice" id="secondChoice"><p class="choices">${stations[1]}</p></div>`;
        
        firstChoice = document.getElementById('firstChoice');
        secondChoice = document.getElementById('secondChoice');
        
        firstChoice.addEventListener("click", () => {
          secondChoice.className = 'choice'
          firstChoice.className = 'choice selected'
          station = stations[0];
        });
        secondChoice.addEventListener("click", () => {
          firstChoice.className = 'choice'
          secondChoice.className = 'choice selected'
          station = stations[1];
        });

      }
    });
};

postalField.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    findClosestStation(postalField.value);
    postalField.value = "";
  }
});


function startCalcul() {
  let stationForCSV =
    station.split("-")[0].split("")[0].toUpperCase() +
    station.split("-")[0].slice(1);

  Papa.parse(`../dataStations/data${stationForCSV}.csv`, {
    download: true,
    header: true,
    delimiter: ";",
    step: function (data) {
      dataStation.push(data.data);
    },
    complete: function () {
      extractTemperatures(dataStation);
      calculation();
    },
  });
}

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
