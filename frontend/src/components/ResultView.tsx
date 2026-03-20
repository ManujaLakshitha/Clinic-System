//frontend/src/components/ResultView.tsx
import { useState } from "react";
import type { ParseResponse } from "../types";
import BillView from "./BillView";

type ResultViewProps = {
  result: ParseResponse | null;
  visitId: number | null;
}

export default function ResultView({ result, visitId }: ResultViewProps) {
  const [total, setTotal] = useState<number | null>(null);

  const generateBill = async () => {
    const res = await fetch(
      `http://localhost:8080/bill?visit_id=${visitId}`
    );
    const data = await res.json();
    setTotal(data.total);
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

      <BillView total={total} />
    </div>
  );
}