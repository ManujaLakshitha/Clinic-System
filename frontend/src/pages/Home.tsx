import { useState } from "react";
import InputBox from "../components/InputBox";
import ResultView from "../components/ResultView";
import VisitList from "../components/VisitList";
import type { ParseResponse } from "../types";

type Tab = "new" | "history";

export default function Home() {
  const [result,  setResult]  = useState<ParseResponse | null>(null);
  const [visitId, setVisitId] = useState<number | null>(null);
  const [tab,     setTab]     = useState<Tab>("new");

  return (
    <div style={{ display: "flex", minHeight: "100svh", width: "100%" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        background: "var(--sidebar-bg)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        position: "sticky",
        top: 0,
        height: "100svh",
      }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 28px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 4,
          }}>
            <div style={{
              width: 32, height: 32,
              background: "var(--teal)",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>⚕</div>
            <span style={{
              color: "var(--sidebar-text)",
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: "-0.3px",
            }}>ABC Clinic</span>
          </div>
          <p style={{ color: "var(--sidebar-muted)", fontSize: 11, paddingLeft: 42 }}>
            Notes &amp; Billing
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 10px" }}>
          {([
            { id: "new",     icon: "✦", label: "New Visit"      },
            { id: "history", icon: "◈", label: "Visit History"  },
          ] as { id: Tab; icon: string; label: string }[]).map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: tab === item.id ? "var(--sidebar-active)" : "transparent",
                color: tab === item.id ? "var(--sidebar-text)" : "var(--sidebar-muted)",
                fontSize: 13,
                fontWeight: tab === item.id ? 500 : 400,
                fontFamily: "inherit",
                textAlign: "left",
                marginBottom: 2,
                transition: "all 0.15s",
                borderLeft: tab === item.id
                  ? "2px solid var(--sidebar-accent)"
                  : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: 12, opacity: 0.8 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: "16px 20px 0",
          borderTop: "1px solid #1e2233",
          marginTop: 16,
        }}>
          <p style={{ color: "var(--sidebar-muted)", fontSize: 11 }}>
            Powered by Claude AI
          </p>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Top bar */}
        <header style={{
          padding: "18px 32px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <div>
            <h1 style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--ink)",
              letterSpacing: "-0.3px",
            }}>
              {tab === "new" ? "New Visit" : "Visit History"}
            </h1>
            <p style={{ color: "var(--ink-muted)", fontSize: 12, marginTop: 1 }}>
              {tab === "new"
                ? "Enter patient data — drugs, tests, and notes together"
                : "Browse and manage past visits"}
            </p>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--teal-light)",
            border: "1px solid var(--teal-mid)",
            borderRadius: 99,
            padding: "4px 12px 4px 8px",
          }}>
            <span style={{
              width: 7, height: 7,
              background: "var(--teal)",
              borderRadius: "50%",
              display: "inline-block",
              animation: "pulse-dot 2s ease-in-out infinite",
            }} />
            <span style={{ color: "var(--teal-dark)", fontSize: 12, fontWeight: 500 }}>
              AI Ready
            </span>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {tab === "new" ? (
            <>
              <InputBox setResult={setResult} setVisitId={setVisitId} />
              <ResultView result={result} visitId={visitId} />
            </>
          ) : (
            <VisitList />
          )}
        </div>
      </main>
    </div>
  );
}