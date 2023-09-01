let stations = new Array();
let station = "";
let resultatElement = document.getElementById("resultat");
let stationElement = document.getElementById("station");
let postalField = document.getElementById("postal-field");
let info = document.getElementById("infos");
let input = document.getElementById("input");
let reloadButton = document.getElementsByClassName("reload-button")[0];

reset();

function reset() {
  resultatElement = document.getElementById("resultat");
  stationElement = document.getElementById("station");
  input = document.getElementById("input");
  resultatElement.innerHTML = "";
  stationElement.innerHTML = "";
  input.innerHTML =
    '<div class="info" id="infos">Code postal</div><div class="form"><input type="field" id="postal-field"></div>';
  postalField = document.getElementById("postal-field");
  info = document.getElementById("infos");
  reloadButton = document.getElementsByClassName("reload-button")[0];

  reloadButton.addEventListener("click", () => {
    reset();
  });

  postalField.addEventListener("keypress",function(e) {
    if (e.key === "Enter") {
      findClosestStation(postalField.value);
      postalField.value = "";
    }
  })
}

function findClosestStation(codePostal) {
  stations = new Array();

  fetch("../geoCommunes.json")
    .then((response) => response.json())
    .then((JSCommunes) => {
      JSCommunes.forEach((element) => {
        if (element.postal == codePostal.toString()) {
          resultatElement.innerHTML += `<p class="text">Commune : <strong>${element.name}  
          </strong>closestStation : <strong>${element.closestStation}<strong></p>`;
          if (!stations.includes(element.closestStation)) {
            stations.push(element.closestStation);
          }
        }
      });
      displayStationElements();
      return stations;
    });
}

function displayStationElements() {
  if (stations.length == 0) {
    info.innerHTML = "Aucune ville trouvée";
    return;
  }

  input.innerHTML = `<div class="info" id="infos">SeuilRef</div>
  <div class="form">
  <input type="field" id="postal-field" />
  </div>`;

  createStationElement();
  const postalField = document.getElementById("postal-field");

  function keyPressEvent (e) {
    if (e.key === "Enter" && stations.includes(station)) {
      console.log(postalField.value)
      seuilRef = postalField.value;
      input.removeEventListener("keypress", keyPressEvent)
      startCalcul();
    }
  }
  input.addEventListener("keypress", keyPressEvent)
}

function createStationElement() {

  if(stations[1]!=undefined){
    stationElement.innerHTML += `<div class="choice" id="firstChoice"><p class="choices">${stations[0]}</p></div>`;
    stationElement.innerHTML += `<div class="choice" id="secondChoice"><p class="choices">${stations[1]}</p></div>`;

    const firstChoice = document.getElementById("firstChoice");
    const secondChoice = document.getElementById("secondChoice");

    firstChoice.addEventListener("click", () => {
      secondChoice.className = "choice";
      firstChoice.className = "choice selected";
      station = stations[0];
    });
    secondChoice.addEventListener("click", () => {
      firstChoice.className = "choice";
      secondChoice.className = "choice selected";
      station = stations[1];
    });
  }
  else {
    stationElement.innerHTML += `<div class="choice selected" id="uniqueChoice"><p class="choices">${stations[0]}</p></div>`
    const uniqueChoice = document.getElementById('uniqueChoice')
    uniqueChoice.style.height = '100%'
    station = stations[0]
  }

  // stationElement.innerHTML += `<div class="choice" id="firstChoice"><p class="choices">${stations[0]}</p></div>`;
  // stationElement.innerHTML += `<div class="choice" id="secondChoice"><p class="choices">${stations[1]}</p></div>`;

  // firstChoice = document.getElementById("firstChoice");
  // secondChoice = document.getElementById("secondChoice");

  // firstChoice.addEventListener("click", () => {
  //   secondChoice.className = "choice";
  //   firstChoice.className = "choice selected";
  //   station = stations[0];
  // });
  // secondChoice.addEventListener("click", () => {
  //   firstChoice.className = "choice";
  //   secondChoice.className = "choice selected";
  //   station = stations[1];
  // });
}

function startCalcul() {
  console.log(seuilRef)
  let stationForCSV =
    station.split("-")[0].split("")[0].toUpperCase() +
    station.split("-")[0].slice(1);

  let dataStation = new Array();
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
