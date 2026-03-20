import { useState, useRef } from "react";
import { processText } from "../services/api";
import type { ParseResponse } from "../types";

type InputBoxProps = {
  setResult:  (data: ParseResponse) => void;
  setVisitId: (id: number) => void;
};

export default function InputBox({ setResult, setVisitId }: InputBoxProps) {
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!input.trim()) { setError("Please enter patient data first."); return; }
    setLoading(true);
    setError(null);
    try {
      const data = await processText(input);
      setResult(data);
      setVisitId(data.visit_id);
      setInput("");
      textareaRef.current?.blur();
    } catch {
      setError("Classification failed. Make sure the backend is running and ANTHROPIC_API_KEY is set.");
    } finally {
      setLoading(false);
    }
  };

  const charCount = input.length;

  return (
    <div style={{
      background: "var(--surface)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-sm)",
      overflow: "hidden",
      marginBottom: 24,
    }}>
      {/* Card header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid var(--surface-3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28,
            background: "var(--teal-light)",
            borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, color: "var(--teal)",
          }}>✦</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)" }}>
              Unified Clinical Input
            </p>
            <p style={{ fontSize: 11, color: "var(--ink-muted)" }}>
              Type everything together — drugs, tests, observations
            </p>
          </div>
        </div>
        <span style={{
          fontSize: 11,
          color: "var(--ink-faint)",
          fontFamily: "'DM Mono', monospace",
        }}>
          {charCount} chars
        </span>
      </div>

      {/* Textarea */}
      <div style={{ position: "relative" }}>
        <textarea
          ref={textareaRef}
          rows={5}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
          placeholder={"e.g. paracetamol 500mg TDS x5 days, FBC, blood glucose, fever 38°C, review in 1 week"}
          style={{
            width: "100%",
            padding: "16px 20px",
            border: "none",
            outline: "none",
            resize: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--ink)",
            background: loading ? "var(--surface-2)" : "var(--surface)",
            transition: "background 0.2s",
          }}
        />
      </div>

      {/* Footer bar */}
      <div style={{
        padding: "12px 20px",
        borderTop: "1px solid var(--surface-3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--surface-2)",
      }}>
        <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>
          Press <kbd style={{
            background: "var(--surface-3)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "1px 5px",
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
          }}>⌘ Enter</kbd> to classify
        </p>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 18px",
            background: loading ? "var(--surface-3)" : "var(--teal)",
            color: loading ? "var(--ink-muted)" : "white",
            border: "none",
            borderRadius: "var(--radius-sm)",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            letterSpacing: "-0.1px",
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: 12, height: 12,
                border: "2px solid var(--border-strong)",
                borderTopColor: "var(--teal)",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.7s linear infinite",
              }} />
              Classifying…
            </>
          ) : (
            <>✦ Classify with AI</>
          )}
        </button>
      </div>

      {error && (
        <div style={{
          padding: "10px 20px",
          background: "var(--red-light)",
          borderTop: "1px solid #fecaca",
          fontSize: 12,
          color: "var(--red)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          ⚠ {error}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea::placeholder { color: var(--ink-faint); }
      `}</style>
    </div>
  );
}