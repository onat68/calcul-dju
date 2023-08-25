const fs = require("fs");
const csvParser = require("csv-parser");
const prompt = require("prompt-sync")();
let dataStation = [];
let sortedTemperature = [];
let seuilRef = 18

const JSONCommunes = fs.readFileSync("./geoCommunes copy.json", "utf-8");
const JSCommunes = JSON.parse(JSONCommunes);

const JSONStations = fs.readFileSync("./geoStations.json", "utf8");
const JSStations = JSON.parse(JSONStations)

JSStations.forEach((element) => {
    // console.log(element.name)
    JSCommunes.forEach((commune) => {
        if(element.name == commune.closestStation){
            element.status = 'ok'
        }
    })
    if(element.status==undefined){
        console.log(element.name)
    }
})