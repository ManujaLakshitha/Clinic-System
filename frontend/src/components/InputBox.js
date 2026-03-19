import { useState } from "react";
import { processText } from "../services/api";

export default function InputBox() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const data = await processText(input);
    setResult(data);
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}