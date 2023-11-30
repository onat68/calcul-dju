postalField.addEventListener("keypress",function(e) {
  if (e.key === "Enter") {
    findClosestStation(postalField.value);
    postalField.value = "";
  }
})

reloadButton.addEventListener("click", () => {
  location.reload();
});

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
      setSeuilRef(postalField.value);
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
}

function startCalcul() {
  console.log(seuilRef);
  station =
    station.split("-")[0].split("")[0].toUpperCase() +
    station.split("-")[0].slice(1);

  fetch(`http://localhost:3000/station/${station}`, {
    method: "GET"
  })
  .then((response) => response.json)
  .then((data) => {
    calculation();
  })

}
