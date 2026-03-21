import { useEffect, useState } from "react";
import {
  Pill,
  Beaker,
  FileText,
  Printer,
  AlertCircle,
  Plus,
  Trash2
} from "lucide-react";
import type { ParseResponse } from "../types";
import BillView from "./BillView";
import { getBill, saveVisit } from "../services/api";
import PrintBill from "./PrintBill";

type ResultViewProps = {
  result: ParseResponse | null;
  visitId: number | null;
  visitDate?: string;
  setVisitId: (id: number) => void;
};

type Category = {
  key: keyof Pick<ParseResponse, "drugs" | "lab_tests" | "notes">;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
};

const CATEGORIES: Category[] = [
  {
    key: "drugs",
    label: "Drugs & Dosages",
    icon: <Pill size={14} />,
    color: "text-amber-800",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    key: "lab_tests",
    label: "Lab Tests",
    icon: <Beaker size={14} />,
    color: "text-blue-800",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    key: "notes",
    label: "Clinical Notes",
    icon: <FileText size={14} />,
    color: "text-emerald-800",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
];

export default function ResultView({ result, visitId, visitDate, setVisitId }: ResultViewProps) {
  const [editable, setEditable] = useState<ParseResponse | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [billingLoad, setBillingLoad] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    if (result) {
      setEditable(result);
    }
  }, [result]);

  if (!result || !editable) return null;

  const totalItems = (result.drugs?.length || 0) +
    (result.lab_tests?.length || 0) +
    (result.notes?.length || 0);

  const updateItem = (type: "drugs" | "lab_tests" | "notes", index: number, value: string) => {
    const currentArray = editable[type] as string[];
    const copy = [...currentArray];
    copy[index] = value;
    setEditable({ ...editable, [type]: copy });
  };

  const deleteItem = (type: "drugs" | "lab_tests" | "notes", index: number) => {
    const currentArray = editable[type] as string[];
    const copy = currentArray.filter((_, i) => i !== index);
    setEditable({ ...editable, [type]: copy });
  };

  const addItem = (type: "drugs" | "lab_tests" | "notes") => {
    const currentArray = editable[type] as string[];
    setEditable({
      ...editable,
      [type]: [...currentArray, ""],
    });
  };

  const handleSave = async () => {
    if (!editable) return;
    setLoading(true);

    try {
      const data = await saveVisit({
        drugs: editable.drugs,
        lab_tests: editable.lab_tests,
        notes: editable.notes,
      });

      console.log("Success data:", data);

      if (data && data.visit_id) {
        alert("✅ Saved Successfully! Visit ID: " + data.visit_id);
        setVisitId(data.visit_id);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Save Error Detail:", error);
      alert("❌ Save failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

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

  const handlePrintBill = () => {
    setShowPrintModal(true);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = document.getElementById('print-bill-content');
    if (printContent) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Bill - ABC Health Clinic</title>
            <meta charset="utf-8" />
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', system-ui, sans-serif;
                background: white;
                padding: 20px;
              }
              @media print {
                body {
                  padding: 0;
                }
                .no-print {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const renderSection = (
    title: string,
    type: "drugs" | "lab_tests" | "notes",
    icon: React.ReactNode
  ) => {

    const items = editable[type] as string[];

    return (
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            {icon} {title}
          </h3>
          <button
            onClick={() => addItem(type)}
            className="text-xs flex items-center gap-1 text-green-600"
          >
            <Plus size={12} /> Add
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-xs text-gray-400">No data</p>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={item}
                onChange={(e) => updateItem(type, i, e.target.value)}
                className="flex-1 border px-2 py-1 rounded text-xs"
              />
              <button
                onClick={() => deleteItem(type, i)}
                className="text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-sm">Doctor Review Mode</h2>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded text-xs"
          >
            {loading ? "Saving..." : "Confirm & Save"}
          </button>

          <button
            onClick={handleBill}
            disabled={!visitId}
            className="px-4 py-2 bg-blue-600 text-white rounded text-xs"
          >
            Generate Bill
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            disabled={!total}
            className="px-4 py-2 bg-teal-600 text-white rounded text-xs"
          >
            Print
          </button>
        </div>
      </div>

      {/* EDIT SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderSection("Drugs", "drugs", <Pill size={14} />)}
        {renderSection("Lab Tests", "lab_tests", <Beaker size={14} />)}
        {renderSection("Notes", "notes", <FileText size={14} />)}
      </div>

      {/* Three category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map(cat => {
          // Safely get items with fallback to empty array
          const items = result[cat.key] || [];
          return (
            <div
              key={cat.key}
              className={`${cat.bgColor} border ${cat.borderColor} rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all`}
            >
              {/* Card header */}
              <div
                className={`px-4 py-3 border-b ${cat.borderColor} flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <span className={cat.color}>{cat.icon}</span>
                  <span className={`text-xs font-semibold ${cat.color}`}>
                    {cat.label}
                  </span>
                </div>
                <span
                  className={`bg-white ${cat.color} border ${cat.borderColor} rounded-full px-2 py-0.5 text-xs font-semibold min-w-[28px] text-center`}
                >
                  {items.length}
                </span>
              </div>

              {/* Items */}
              <div className="p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-gray-400 text-xs text-center py-4">
                    None identified
                  </p>
                ) : (
                  <div className="space-y-2">
                    {items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-2 bg-white rounded-lg text-sm text-gray-700 hover:shadow-sm transition-all"
                      >
                        <span className={`${cat.color} font-bold text-xs mt-0.5 flex-shrink-0`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-xs break-words flex-1">{item}</span>
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
        <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-lg">
          <AlertCircle size={14} />
          {billingError}
        </div>
      )}

      <BillView total={total}
        drugs={editable.drugs || []}
        tests={editable.lab_tests || []} />

      {/* Print Bill Modal */}
      {showPrintModal && total && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Print Bill Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-all flex items-center gap-2"
                >
                  <Printer size={16} />
                  Print
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-6 bg-gray-50">
              <PrintBill
                visitId={visitId!}
                visitDate={visitDate || new Date().toISOString()}
                drugs={editable.drugs || []}
                labTests={editable.lab_tests || []}
                notes={editable.notes || []}
                total={total}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}