const fs = require('fs')

const JSONCommunes = fs.readFileSync('calcul-dju/geoCommunes.json', "utf8");  //C:/Users/onatr/OneDrive/Documents/Ada/CalculDJU/calcul-dju/geoCommunes.json
const JSCommunes = JSON.parse(JSONCommunes)

const JSONStations = fs.readFileSync("calcul-dju/geoStations.json", "utf8");
const JSStations = JSON.parse(JSONStations)

const checkDistance = (latitude,longitude) => {
    let distanceMin = 1000
    let closest = ""
    for(let j=0;j<JSStations.length;j++){

        let deltaLatitude = parseInt(latitude) - parseInt(JSStations[j].latitude)
        let deltaLongitude = parseInt(longitude) - parseInt(JSStations[j].longitude)
        let distance = Math.sqrt((deltaLatitude*deltaLatitude)+(deltaLongitude*deltaLongitude))

        if(distance < distanceMin){
            closest = JSStations[j].name
            distanceMin = distance
        }
    }
    return closest
}

const findClosest = () => {
    for(let i=0;i<JSCommunes.length;i++){
        JSCommunes[i].closestStation = checkDistance(JSCommunes[i].latitude,JSCommunes[i].longitude)
    }
}

findClosest()

let newString = JSON.stringify(JSCommunes)

fs.writeFileSync("./geoCommunes.json", newString);

// console.log(JSCommunes)