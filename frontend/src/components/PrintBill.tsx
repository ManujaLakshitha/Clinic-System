import {
  Stethoscope,
  Receipt,
  Calendar,
  User,
  Pill,
  Beaker,
  FileText,
  Phone,
  MapPin,
  Mail,
  Clock,
} from "lucide-react";

type PrintBillProps = {
  visitId: number;
  visitDate: string;
  drugs: string[];
  labTests: string[];
  notes: string[];
  total: number;
};

const DRUG_PRICE = 50;
const TEST_PRICE = 200;
const CONSULTATION_FEE = 500;

export default function PrintBill({
  visitId,
  visitDate,
  drugs,
  labTests,
  notes,
}: PrintBillProps) {

  const drugTotal = drugs.length * DRUG_PRICE;
  const testTotal = labTests.length * TEST_PRICE;
  const grandTotal = CONSULTATION_FEE + drugTotal + testTotal;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  return (
    <div id="print-bill-content" className="print-bill-container">
      {/* Bill Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-500 px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">ABC Health Clinic</h1>
                  <p className="text-xs text-teal-100 mt-1">Excellence in Healthcare</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Receipt className="w-4 h-4" />
                  <span className="text-sm font-mono font-semibold">BILL #{visitId}</span>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm border-t border-teal-400/30 pt-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs">123 Healthcare Avenue, Medical District</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  <span className="text-xs">+94 11 234 5678</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  <span className="text-xs">info@abcclinic.com</span>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">{formatDate(visitDate)}</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">Generated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <div className="px-8 py-5 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Patient Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Visit ID</p>
              <p className="text-sm font-semibold text-gray-900">#{visitId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date of Visit</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(visitDate)}</p>
            </div>
          </div>
        </div>

        {/* Bill Items */}
        <div className="px-8 py-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Bill Details</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Qty</th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Unit Price</th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Consultation Fee */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-teal-500" />
                      <span className="text-sm font-medium text-gray-900">Consultation Fee</span>
                    </div>
                  </td>
                  <td className="text-right text-sm text-gray-600">1</td>
                  <td className="text-right text-sm text-gray-600 font-mono">{formatCurrency(CONSULTATION_FEE)}</td>
                  <td className="text-right text-sm font-semibold text-gray-900 font-mono">{formatCurrency(CONSULTATION_FEE)}</td>
                </tr>

                {/* Medications */}
                {drugs.length > 0 && (
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-blue-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-900">Medications</span>
                          {drugs.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                              {drugs.map((drug, idx) => (
                                <div key={idx}>{drug}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-right text-sm text-gray-600 align-top">{drugs.length}</td>
                    <td className="text-right text-sm text-gray-600 font-mono align-top">{formatCurrency(DRUG_PRICE)}</td>
                    <td className="text-right text-sm font-semibold text-gray-900 font-mono align-top">{formatCurrency(drugTotal)}</td>
                  </tr>
                )}

                {/* Lab Tests */}
                {labTests.length > 0 && (
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Beaker className="w-4 h-4 text-purple-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-900">Laboratory Tests</span>
                          {labTests.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                              {labTests.map((test, idx) => (
                                <div key={idx}>{test}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-right text-sm text-gray-600 align-top">{labTests.length}</td>
                    <td className="text-right text-sm text-gray-600 font-mono align-top">{formatCurrency(TEST_PRICE)}</td>
                    <td className="text-right text-sm font-semibold text-gray-900 font-mono align-top">{formatCurrency(testTotal)}</td>
                  </tr>
                )}

                {/* Clinical Notes */}
                {notes.length > 0 && (
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td colSpan={4} className="py-3">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-green-500 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-gray-900">Clinical Notes</span>
                          <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                            {notes.map((note, idx) => (
                              <div key={idx}>• {note}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t-2 border-gray-200">
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-mono">{formatCurrency(CONSULTATION_FEE + drugTotal + testTotal)}</span>
                </div>

                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-teal-600 font-mono text-xl">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-2">Thank you for choosing ABC Health Clinic</p>
          <p className="text-xs text-gray-400">This is a computer-generated invoice. No signature required.</p>
          <p className="text-xs text-gray-400 mt-2">For any queries, please contact our billing department at billing@abcclinic.com</p>
        </div>
      </div>

      <style>{`
        @media print {
  body * {
    visibility: hidden;
  }

  #print-bill-content,
  #print-bill-content * {
    visibility: visible;
  }

  #print-bill-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  #print-bill-content * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
          
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}