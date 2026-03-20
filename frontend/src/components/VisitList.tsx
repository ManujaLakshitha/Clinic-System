//frontend/src/components/VisitList.tsx
import { useEffect, useState } from "react";
import { deleteVisit, getVisitDetails, getVisits } from "../services/api";

export default function VisitList() {
    const [visits, setVisits] = useState([]);
    const [selected, setSelected] = useState<any>(null);

    useEffect(() => {
        getVisits().then(setVisits);
    }, []);

    const handleClick = async (id: number) => {
        const data = await getVisitDetails(id);
        setSelected(data);
    };

    const handleDelete = async (id: number) => {
        await deleteVisit(id);

        const updated = await getVisits();
        setVisits(updated);
    };

    return (
        <div>
            <h3>Visit History</h3>

            {visits.map((v: any) => (
                <div
                    key={v.id}
                    onClick={() => handleClick(v.id)}
                    style={{
                        cursor: "pointer",
                        padding: "8px",
                        border: "1px solid #ccc",
                        marginBottom: "5px",
                    }}
                >
                    Visit ID: {v.id}
                </div>
            ))}

            {selected && (
                <div>
                    <h4>Details</h4>
                    {selected.drugs?.map((d: string, i: number) => <p key={i}>{d}</p>)}
                    {selected.lab_tests?.map((t: string, i: number) => <p key={i}>{t}</p>)}
                    {selected.notes?.map((n: string, i: number) => <p key={i}>{n}</p>)}
                </div>
            )}

            {visits.map((v: any) => (
                <div
                    key={v.id}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px",
                        border: "1px solid #ccc",
                        marginBottom: "5px",
                    }}
                >
                    <span
                        onClick={() => handleClick(v.id)}
                        style={{ cursor: "pointer", flex: 1 }}
                    >
                        Visit ID: {v.id}
                    </span>
                    <button onClick={() => handleDelete(v.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}