import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Stethoscope, 
  History, 
  LogOut, 
  User, 
  Sparkles,
  Menu,
  X
} from "lucide-react";
import InputBox from "../components/InputBox";
import ResultView from "../components/ResultView";
import VisitList from "../components/VisitList";
import type { ParseResponse } from "../types";

type Tab = "new" | "history";

export default function Home() {
  const navigate = useNavigate();
  const [result, setResult] = useState<ParseResponse | null>(null);
  const [visitId, setVisitId] = useState<number | null>(null);
  const [visitDate, setVisitDate] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("new");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userId = localStorage.getItem("user_id") ?? "—";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // When result is set, also set the visit date
  const handleSetResult = (data: ParseResponse) => {
    setResult(data);
    setVisitDate(new Date().toISOString());
  };

  return (
    <div style={{ display: "flex", minHeight: "100svh", width: "100%" }}>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-all"
      >
        <Menu size={20} className="text-gray-700" />
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 w-72 bg-gray-900 h-screen overflow-y-auto transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="p-6 pb-8 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-gray-100 font-semibold text-lg tracking-tight block">
                  ABC Clinic
                </span>
                <span className="text-gray-400 text-xs">Notes & Billing</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            <button
              onClick={() => {
                setTab("new");
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${tab === "new"
                  ? "bg-gray-800 text-teal-400 border-l-2 border-teal-500"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }
              `}
            >
              <Sparkles size={18} />
              <span className="text-sm font-medium">New Visit</span>
            </button>

            <button
              onClick={() => {
                setTab("history");
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${tab === "history"
                  ? "bg-gray-800 text-teal-400 border-l-2 border-teal-500"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }
              `}
            >
              <History size={18} />
              <span className="text-sm font-medium">Visit History</span>
            </button>
          </nav>

          <div className="px-4 py-4 border-t border-gray-800">
            <div className="flex items-center gap-3 px-3 py-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                <User className="w-4 h-4 text-teal-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 text-sm font-medium truncate">
                  User #{userId}
                </p>
                <p className="text-gray-500 text-xs">Logged in</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-900/30 hover:text-red-400 transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>

          <div className="px-6 py-4 border-t border-gray-800">
            <p className="text-gray-500 text-xs text-center">
              Powered by ABC Clinic
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 pt-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="w-10 lg:hidden" />
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                {tab === "new" ? "New Visit" : "Visit History"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {tab === "new"
                  ? "Enter patient data — drugs, tests, and notes together"
                  : "Browse and manage past visits"}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm text-teal-700 font-medium whitespace-nowrap">
                AI Ready
              </span>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            {tab === "new" ? (
              <>
                <InputBox setResult={handleSetResult} setVisitId={setVisitId} />
                <ResultView result={result} visitId={visitId} visitDate={visitDate || undefined} />
              </>
            ) : (
              <VisitList />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}