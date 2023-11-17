import { supabase } from "./app";

export const getByStation = async (req: any, res: any) => {
  let { data, error } = await supabase
    .from("dataStation")
    .select("*")
    .eq("station_name", req.params.station);

  if (error) {
    res.status(500).json({ error });
  }

  res.status(200).json(data);
};

export const getCitiesByPostal = async (req: any, res: any) => {
  let { data, error } = await supabase
  .from("communes")
  .select("*")
  .eq("postal", req.params.postal)

  if (error) {
    res.status(500).json({ error })
  }

  res.status(200).json(data)
}

const calculDJU = (tmin: number, tmax: number, seuilRef: number): number => {
  let moyenneTemp = (tmin + tmax) / 2;
  if (seuilRef == 999) {
    return seuilRef;
  }
  if (moyenneTemp > seuilRef) {
    return 0;
  } else {
    return seuilRef - moyenneTemp;
  }
};

const calculDJUMoyen = (arrayOfDates: any[], seuilRef: number): number => {
  let totalDJU = 0;
  for (const entry in arrayOfDates) {
    totalDJU += calculDJU(
      arrayOfDates[entry].tmin,
      arrayOfDates[entry].tmax,
      seuilRef
    );
  }
  return totalDJU / arrayOfDates.length;
};

export const getDJUByWinter = async (req: any, res: any) => {
  const seuilRef: number = req.params.seuilRef;
  const station: string = req.params.station;
  const winter: number = req.params.winter;

  console.log(station, winter, seuilRef);

  let { data, error } = await supabase
    .from("dataStation")
    .select("*")
    .eq("winter_by_end_year", winter)
    .eq("station_name", station);

  const DJUMoyen: number = calculDJUMoyen(data, seuilRef);

  if (error) {
    res.status(500).json({ error });
  }

  res.status(200).json(DJUMoyen);
};


