import { useState } from "react";
import {
  Pill,
  Beaker,
  FileText,
  Receipt,
  Printer,
  Loader2,
  AlertCircle
} from "lucide-react";
import type { ParseResponse } from "../types";
import BillView from "./BillView";
import { getBill } from "../services/api";
import PrintBill from "./PrintBill";

type ResultViewProps = {
  result: ParseResponse | null;
  visitId: number | null;
  visitDate?: string;
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

export default function ResultView({ result, visitId, visitDate }: ResultViewProps) {
  const [total, setTotal] = useState<number | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [billingLoad, setBillingLoad] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  if (!result) return null;

  const totalItems = (result.drugs?.length || 0) +
    (result.lab_tests?.length || 0) +
    (result.notes?.length || 0);

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

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">
            Classification Results
          </h2>
          <span className="bg-teal-50 text-teal-800 border border-teal-200 rounded-full px-2.5 py-0.5 text-xs font-semibold">
            {totalItems} items
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBill}
            disabled={billingLoad}
            className="no-print px-3.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {billingLoad ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Receipt size={14} />
            )}
            Generate Bill
          </button>

          <button
            onClick={handlePrintBill}
            disabled={!total}
            className="no-print px-3.5 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Printer size={14} />
            Print Bill
          </button>

        </div>
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

      <BillView total={total} drugs={result.drugs || []} tests={result.lab_tests || []} />

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
                drugs={result.drugs || []}
                labTests={result.lab_tests || []}
                notes={result.notes || []}
                total={total}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}