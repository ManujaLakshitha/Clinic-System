//frontend/src/components/VisitList.tsx
import { useEffect, useState } from "react";
import { deleteVisit, getVisitDetails, getVisits } from "../services/api";
import type { VisitSummary, VisitDetails } from "../types";

export default function VisitList() {
  const [visits,   setVisits]   = useState<VisitSummary[]>([]);
  const [selected, setSelected] = useState<VisitDetails | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getVisits();
      setVisits(data);
    } catch {
      setError("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(id: number) {
    if (activeId === id) { setSelected(null); setActiveId(null); return; }
    try {
      const data = await getVisitDetails(id);
      setSelected(data);
      setActiveId(id);
    } catch {
      setError("Failed to load visit details.");
    }
  }

  async function handleDelete(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    if (!window.confirm(`Delete visit #${id}?`)) return;
    try {
      await deleteVisit(id);
      if (activeId === id) { setSelected(null); setActiveId(null); }
      await load();
    } catch {
      setError("Failed to delete visit.");
    }
  }

  function fmt(iso: string) {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  const totalItems = (d: VisitDetails) =>
    d.drugs.length + d.lab_tests.length + d.notes.length;

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
            Visit History
          </h2>
          <p style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 2 }}>
            {visits.length} visit{visits.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <button
          onClick={load}
          style={{
            padding: "6px 14px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontSize: 12,
            color: "var(--ink-muted)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div style={{
          padding: "10px 14px",
          background: "var(--red-light)",
          border: "1px solid #fecaca",
          borderRadius: "var(--radius-sm)",
          color: "var(--red)",
          fontSize: 12,
          marginBottom: 14,
        }}>
          ⚠ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ink-muted)", fontSize: 13 }}>
          Loading…
        </div>
      ) : visits.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          color: "var(--ink-muted)",
          fontSize: 13,
        }}>
          <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>◈</div>
          No visits recorded yet.
          <br />Switch to <strong>New Visit</strong> to create one.
        </div>
      ) : (
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}>
          {/* Table head */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "60px 1fr 1fr auto",
            padding: "10px 16px",
            background: "var(--surface-2)",
            borderBottom: "1px solid var(--border)",
          }}>
            {["ID", "Date & Time", "Summary", "Actions"].map(h => (
              <span key={h} style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--ink-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                textAlign: h === "Actions" ? "right" : "left",
              }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {visits.map((v, idx) => (
            <div key={v.id}>
              <div
                onClick={() => handleSelect(v.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 1fr auto",
                  padding: "13px 16px",
                  borderBottom: idx < visits.length - 1 ? "1px solid var(--border)" : "none",
                  cursor: "pointer",
                  background: activeId === v.id ? "var(--teal-light)" : "var(--surface)",
                  transition: "background 0.15s",
                  alignItems: "center",
                }}
              >
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  color: "var(--ink-muted)",
                  fontWeight: 500,
                }}>
                  #{v.id}
                </span>

                <span style={{ fontSize: 13, color: "var(--ink)" }}>
                  {fmt(v.created_at)}
                </span>

                <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>
                  {activeId === v.id && selected
                    ? `${selected.drugs.length} drugs · ${selected.lab_tests.length} tests · ${selected.notes.length} notes`
                    : "Click to expand"}
                </span>

                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                  <button
                    onClick={(e) => handleDelete(e, v.id)}
                    style={{
                      padding: "4px 10px",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 11,
                      color: "var(--red)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontWeight: 500,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded detail row */}
              {activeId === v.id && selected && (
                <div className="fade-up" style={{
                  padding: "16px 20px",
                  background: "var(--teal-light)",
                  borderBottom: idx < visits.length - 1 ? "1px solid var(--teal-mid)" : "none",
                }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                  }}>
                    {([
                      { label: "💊 Drugs",      items: selected.drugs     },
                      { label: "🔬 Lab Tests",  items: selected.lab_tests },
                      { label: "📋 Notes",      items: selected.notes     },
                    ] as { label: string; items: string[] }[]).map(col => (
                      <div key={col.label}>
                        <p style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--teal-dark)",
                          marginBottom: 6,
                          textTransform: "uppercase",
                          letterSpacing: "0.4px",
                        }}>
                          {col.label}
                        </p>
                        {col.items.length === 0 ? (
                          <p style={{ fontSize: 12, color: "var(--ink-faint)" }}>—</p>
                        ) : col.items.map((item, i) => (
                          <div key={i} style={{
                            fontSize: 12,
                            color: "var(--ink)",
                            padding: "4px 8px",
                            background: "white",
                            borderRadius: 5,
                            marginBottom: 4,
                            border: "1px solid var(--teal-mid)",
                          }}>
                            {item}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}