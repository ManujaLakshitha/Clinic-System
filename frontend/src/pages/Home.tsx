//frontend/src/pages/Home.tsx
import { useState } from "react";
import InputBox from "../components/InputBox";
import ResultView from "../components/ResultView";
import type { ParseResponse } from "../types";
import VisitList from "../components/visitList";

export default function Home() {
  const [result, setResult] = useState<ParseResponse | null>(null);
  const [visitId, setVisitId] = useState<number | null>(null);

  return (
    <div>
      <InputBox setResult={setResult} setVisitId={setVisitId} />
      <ResultView result={result} visitId={visitId} />

      <VisitList />
    </div>
  );
}