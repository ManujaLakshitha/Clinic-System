//frontend/src/components/ResultView.tsx
import { useState } from "react";
import type { ParseResponse } from "../types";
import BillView from "./BillView";
import { getBill } from "../services/api";

type ResultViewProps = {
  result:  ParseResponse | null;
  visitId: number | null;
};

type Category = {
  key:    keyof Pick<ParseResponse, "drugs" | "lab_tests" | "notes">;
  label:  string;
  icon:   string;
  color:  string;
  bg:     string;
  border: string;
};

const CATEGORIES: Category[] = [
  { key: "drugs",     label: "Drugs & Dosages",         icon: "💊", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  { key: "lab_tests", label: "Lab Tests",               icon: "🔬", color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
  { key: "notes",     label: "Clinical Notes",          icon: "📋", color: "#065f46", bg: "#f0fdfa", border: "#99f6e4" },
];

export default function ResultView({ result, visitId }: ResultViewProps) {
  const [total,        setTotal]        = useState<number | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [billingLoad,  setBillingLoad]  = useState(false);

  if (!result) return null;

  const totalItems =
    result.drugs.length + result.lab_tests.length + result.notes.length;

  const handleBill = async () => {
    if (!visitId) return;
    setBillingLoad(true);
    setBillingError(null);
    try {
      const data = await getBill(visitId);
      setTotal(data.total);
    } catch {
      setBillingError("Failed to generate bill.");
    } finally {
      setBillingLoad(false);
    }
  };

  return (
    <div className="fade-up">
      {/* Summary bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
            Classification Results
          </h2>
          <span style={{
            background: "var(--teal-light)",
            color: "var(--teal-dark)",
            border: "1px solid var(--teal-mid)",
            borderRadius: 99,
            padding: "2px 10px",
            fontSize: 11,
            fontWeight: 600,
          }}>
            {totalItems} items
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleBill}
            disabled={billingLoad}
            className="no-print"
            style={{
              padding: "7px 14px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--ink)",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {billingLoad ? "…" : "⊕"} Generate Bill
          </button>

          <button
            onClick={() => window.print()}
            className="no-print"
            style={{
              padding: "7px 14px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--ink)",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ⎙ Print
          </button>
        </div>
      </div>

      {/* Three category cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 14,
        marginBottom: 20,
      }}>
        {CATEGORIES.map(cat => {
          const items = result[cat.key] as string[];
          return (
            <div key={cat.key} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
            }}>
              {/* Card header */}
              <div style={{
                padding: "12px 16px",
                background: cat.bg,
                borderBottom: `1px solid ${cat.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 14 }}>{cat.icon}</span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: cat.color,
                  }}>
                    {cat.label}
                  </span>
                </div>
                <span style={{
                  background: "white",
                  color: cat.color,
                  border: `1px solid ${cat.border}`,
                  borderRadius: 99,
                  padding: "1px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  minWidth: 22,
                  textAlign: "center",
                }}>
                  {items.length}
                </span>
              </div>

              {/* Items */}
              <div style={{ padding: 12, minHeight: 60 }}>
                {items.length === 0 ? (
                  <p style={{
                    color: "var(--ink-faint)",
                    fontSize: 12,
                    textAlign: "center",
                    padding: "8px 0",
                  }}>
                    None identified
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {items.map((item, i) => (
                      <div key={i} style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        padding: "6px 10px",
                        background: "var(--surface-2)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 13,
                        color: "var(--ink)",
                        lineHeight: 1.4,
                      }}>
                        <span style={{
                          color: cat.color,
                          fontWeight: 700,
                          fontSize: 10,
                          marginTop: 3,
                          flexShrink: 0,
                        }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {billingError && (
        <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>
          ⚠ {billingError}
        </p>
      )}

      <BillView total={total} drugs={result.drugs} tests={result.lab_tests} />
    </div>
  );
}