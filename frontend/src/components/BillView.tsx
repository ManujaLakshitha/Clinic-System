import { Receipt, Printer } from "lucide-react";

const DRUG_PRICE = 50;
const TEST_PRICE = 200;
const CONSULT = 500;

type BillViewProps = {
  total: number | null;
  drugs: string[];
  tests: string[];
};

export default function BillView({ total, drugs, tests }: BillViewProps) {
  if (total === null) return null;

  const rows = [
    { label: "Consultation fee", qty: 1, unit: CONSULT, amount: CONSULT },
    { label: `Medications (${drugs.length})`, qty: drugs.length, unit: DRUG_PRICE, amount: drugs.length * DRUG_PRICE },
    { label: `Lab tests (${tests.length})`, qty: tests.length, unit: TEST_PRICE, amount: tests.length * TEST_PRICE },
  ].filter(r => r.qty > 0);

  const grandTotal = rows.reduce((s, r) => s + r.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <Receipt size={16} className="text-teal-600" />
          <span className="font-semibold text-sm text-gray-900">Bill Summary</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="no-print p-1.5 hover:bg-gray-100 rounded-lg transition-all"
            title="Print Bill"
          >
            <Printer size={14} className="text-gray-500" />
          </button>
          <span className="text-xs text-gray-400 font-mono">
            Visit #{Date.now().toString().slice(-6)}
          </span>
        </div>
      </div>

      {/* Line items */}
      <div className="p-4 sm:p-5 overflow-x-auto">
        <table className="w-full min-w-[400px] border-collapse">
          <thead>
            <tr>
              {["Description", "Qty", "Unit (Rs.)", "Amount (Rs.)"].map(h => (
                <th
                  key={h}
                  className={`text-left text-xs font-medium text-gray-500 pb-2.5 border-b border-gray-200 uppercase tracking-wide ${
                    h !== "Description" ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="py-2 text-xs sm:text-sm text-gray-900">{r.label}</td>
                <td className="py-2 text-xs sm:text-sm text-right text-gray-500">{r.qty}</td>
                <td className="py-2 text-xs sm:text-sm text-right text-gray-500 font-mono">
                  {r.unit.toLocaleString()}
                </td>
                <td className="py-2 text-xs sm:text-sm text-right text-gray-900 font-mono">
                  {r.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="mt-4 p-3.5 bg-teal-50 border border-teal-200 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="font-semibold text-sm text-teal-900">Total Amount</span>
          <span className="font-bold text-xl sm:text-2xl text-teal-900 font-mono tracking-tight">
            Rs. {grandTotal.toLocaleString()}
          </span>
        </div>

        <p className="mt-2 text-xs text-gray-400 text-right">
          Consult Rs.{CONSULT} · Drug Rs.{DRUG_PRICE} · Test Rs.{TEST_PRICE}
        </p>
      </div>
    </div>
  );
}