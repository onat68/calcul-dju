const fs = require("fs");
const csvParser = require('csv-parser')


fs.readFile("communes-departement-region.csv", "utf-8", (err, data) => {
  if (err) console.log(err);
  else console.log(data);
});

const result = [];
const dataToJSON = (result) => {
    let data = new Array()
    for (let i=0;i<result.length;i++){
        let commune = new Object()
        commune.name = result[i].nom_commune_complet
        commune.postal = result[i].code_postal
        commune.latitude = result[i].latitude
        commune.longitude = result[i].longitude
        data.push(commune)
    }
    fs.writeFileSync('geoCommunes.json', JSON.stringify(data));
}



fs.createReadStream("communes-departement-region.csv")
  .pipe(csvParser())
  .on("data", (data) => {
    result.push(data);
  })
  .on("end", () => {
    dataToJSON(result);
  });



