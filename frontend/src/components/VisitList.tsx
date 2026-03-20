import { useEffect, useState } from "react";
import { getVisits } from "../services/api";

export default function VisitList() {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    getVisits().then(setVisits);
  }, []);

  return (
    <div>
      <h3>Visit History</h3>
      {visits.map((v: any) => (
        <p key={v.id}>Visit ID: {v.id}</p>
      ))}
    </div>
  );
}