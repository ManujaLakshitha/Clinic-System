const DRUG_PRICE = 50;
const TEST_PRICE = 200;
const CONSULT    = 500;

type BillViewProps = {
  total: number | null;
  drugs: string[];
  tests: string[];
};

export default function BillView({ total, drugs, tests }: BillViewProps) {
  if (total === null) return null;

  const rows = [
    { label: "Consultation fee",            qty: 1,            unit: CONSULT,    amount: CONSULT },
    { label: `Medications (${drugs.length})`, qty: drugs.length, unit: DRUG_PRICE, amount: drugs.length * DRUG_PRICE },
    { label: `Lab tests (${tests.length})`,   qty: tests.length, unit: TEST_PRICE, amount: tests.length * TEST_PRICE },
  ].filter(r => r.qty > 0);

  const grandTotal = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="fade-up" style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      boxShadow: "var(--shadow-sm)",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 20px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <span style={{ fontSize: 14 }}>⊕</span>
        <span style={{ fontWeight: 600, fontSize: 13 }}>Bill Summary</span>
        <span style={{
          marginLeft: "auto",
          fontSize: 11,
          color: "var(--ink-muted)",
          fontFamily: "'DM Mono', monospace",
        }}>
          Visit #{Date.now().toString().slice(-6)}
        </span>
      </div>

      {/* Line items */}
      <div style={{ padding: "12px 20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Description", "Qty", "Unit (Rs.)", "Amount (Rs.)"].map(h => (
                <th key={h} style={{
                  textAlign: h === "Description" ? "left" : "right",
                  fontSize: 11,
                  color: "var(--ink-muted)",
                  fontWeight: 500,
                  padding: "4px 0 10px",
                  borderBottom: "1px solid var(--border)",
                  letterSpacing: "0.3px",
                  textTransform: "uppercase",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: "9px 0", fontSize: 13, color: "var(--ink)" }}>
                  {r.label}
                </td>
                <td style={{ padding: "9px 0", fontSize: 13, textAlign: "right", color: "var(--ink-muted)" }}>
                  {r.qty}
                </td>
                <td style={{ padding: "9px 0", fontSize: 13, textAlign: "right", color: "var(--ink-muted)", fontFamily: "'DM Mono', monospace" }}>
                  {r.unit.toLocaleString()}
                </td>
                <td style={{ padding: "9px 0", fontSize: 13, textAlign: "right", fontFamily: "'DM Mono', monospace", color: "var(--ink)" }}>
                  {r.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div style={{
          marginTop: 12,
          padding: "14px 16px",
          background: "var(--teal-light)",
          border: "1px solid var(--teal-mid)",
          borderRadius: "var(--radius)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--teal-dark)" }}>
            Total
          </span>
          <span style={{
            fontWeight: 700,
            fontSize: 22,
            color: "var(--teal-dark)",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "-0.5px",
          }}>
            Rs. {grandTotal.toLocaleString()}
          </span>
        </div>

        <p style={{
          marginTop: 8,
          fontSize: 11,
          color: "var(--ink-faint)",
          textAlign: "right",
        }}>
          Consult Rs.{CONSULT} · Drug Rs.{DRUG_PRICE} · Test Rs.{TEST_PRICE}
        </p>
      </div>
    </div>
  );
}