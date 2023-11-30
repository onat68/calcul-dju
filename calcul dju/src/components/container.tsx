import Inputs from "./inputs.tsx";
import Stations from "./stations.tsx";
import Resultat from "./resultat.tsx";

export default function Container() {
  return (
    <>
      <div className="container">
        <Inputs />
        <Stations />
        <Resultat />
      </div>
    </>
  );
}
