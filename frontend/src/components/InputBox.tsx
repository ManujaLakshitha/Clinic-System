//frontend/src/components/InputBox.tsx
import { useState } from "react";
import { processText } from "../services/api";
import type { ParseResponse } from "../types";

type InputBoxProps = {
  setResult: (data: ParseResponse) => void;
  setVisitId: (id: number) => void;
}

export default function InputBox({ setResult, setVisitId }: InputBoxProps) {
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    if (!input.trim()) {
      alert("Please enter data");
      return;
    }
    
    try {
      const data = await processText(input);
      setResult(data);
      setVisitId(data.visit_id);
    } catch (err) {
      alert("Error occurred");
    }
  };

  return (
    <div>
      <h2>Enter Patient Data</h2>

      <input
        type="text"
        placeholder="e.g. paracetamol 500mg, blood test, fever"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}