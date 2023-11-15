"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDJUByWinter = exports.getByStation = void 0;
const app_1 = require("./app");
const getByStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { data, error } = yield app_1.supabase
        .from("dataStation")
        .select("*")
        .eq("station_name", req.params.station);
    if (error) {
        res.status(500).json({ error });
    }
    res.status(200).json(data);
});
exports.getByStation = getByStation;
const calculDJU = (tmin, tmax, seuilRef) => {
    let moyenneTemp = (tmin + tmax) / 2;
    if (seuilRef == 999) {
        return seuilRef;
    }
    if (moyenneTemp > seuilRef) {
        return 0;
    }
    else {
        return seuilRef - moyenneTemp;
    }
};
const calculDJUMoyen = (arrayOfDates, seuilRef) => {
    let totalDJU = 0;
    for (const entry in arrayOfDates) {
        totalDJU += calculDJU(arrayOfDates[entry].tmin, arrayOfDates[entry].tmax, seuilRef);
    }
    return totalDJU / arrayOfDates.length;
};
const getDJUByWinter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const seuilRef = req.params.seuilRef;
    const station = req.params.station;
    const winter = req.params.winter;
    console.log(station, winter, seuilRef);
    let { data, error } = yield app_1.supabase
        .from("dataStation")
        .select("*")
        .eq("winter_by_end_year", winter)
        .eq("station_name", station);
    const DJUMoyen = calculDJUMoyen(data, seuilRef);
    if (error) {
        res.status(500).json({ error });
    }
    res.status(200).json(DJUMoyen);
});
exports.getDJUByWinter = getDJUByWinter;
