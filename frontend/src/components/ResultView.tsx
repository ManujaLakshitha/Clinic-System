//frontend/src/components/ResultView.tsx
import type { ParseResponse } from "../types";

type ResultViewProps = {
  result: ParseResponse | null;
  visitId: number | null;
}

export default function ResultView({ result, visitId }: ResultViewProps) {
  const generateBill = async () => {
    const res = await fetch(
      `http://localhost:8080/bill?visit_id=${visitId}`
    );
    const data = await res.json();
    alert("Total Bill: " + data.total);
  };

  return (
    <div>
      <h3>Results</h3>

      {result?.drugs?.map((d: string, i: number) => <p key={i}>Drug: {d}</p>)}
      {result?.lab_tests?.map((t:string, i:number) => <p key={i}>Test: {t}</p>)}
      {result?.notes?.map((n:string, i:number) => <p key={i}>Note: {n}</p>)}

      {visitId && (
        <button onClick={generateBill}>Generate Bill</button>
      )}
    </div>
  );
}