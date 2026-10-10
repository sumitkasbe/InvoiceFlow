import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInvoiceById } from "../services/api";

function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getInvoiceById(id);
        setInvoice(data.invoice);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id]);

  const getStatusBadge = (status) => {
    const formatted = status ? status.toLowerCase() : "";
    switch (formatted) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
      case "unpaid":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "overdue":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "draft":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading invoice...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="max-w-4xl mx-auto rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Navigation & Back Action */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            ← Back to Invoices
          </button>

          <button
            type="button"
            onClick={() => navigate(`/invoices/${invoice._id}/edit`)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          >
            Edit Invoice
          </button>
        </div>

        {/* Invoice Container Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-10 space-y-8">

          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Invoice Details
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                {invoice.invoiceNumber}
              </h1>
            </div>

            <span
              className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusBadge(
                invoice.status
              )}`}
            >
              {invoice.status}
            </span>
          </div>

          {/* Client & Metadata Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100 pb-8">
            <div className="space-y-1">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Billed To
              </h2>
              <p className="text-base font-semibold text-slate-900 pt-1">
                {invoice.client?.name}
              </p>
              <p className="text-sm font-medium text-indigo-600">
                {invoice.client?.company}
              </p>
              {invoice.client?.email && (
                <p className="text-xs text-slate-500">{invoice.client.email}</p>
              )}
              {invoice.client?.billingAddress && (
                <p className="text-xs text-slate-500 whitespace-pre-line pt-1">
                  {invoice.client.billingAddress}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:justify-items-end sm:text-right">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Issue Date
                </span>
                <p className="text-sm font-medium text-slate-800 mt-1">
                  {invoice.issueDate
                    ? new Date(invoice.issueDate).toLocaleDateString()
                    : "—"}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Due Date
                </span>
                <p className="text-sm font-medium text-slate-800 mt-1">
                  {invoice.dueDate
                    ? new Date(invoice.dueDate).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Line Items
            </h2>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium text-slate-600">
                      Description
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium text-slate-600 text-center w-24">
                      Qty
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium text-slate-600 text-right w-28">
                      Rate
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium text-slate-600 text-right w-32">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {invoice.items?.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3.5 text-slate-900 font-medium">
                        {item.description}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 text-right">
                        ₹{Number(item.rate).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3.5 text-slate-900 font-semibold text-right">
                        ₹{Number(item.amount ?? item.quantity * item.rate).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary / Totals Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-72 space-y-2.5">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal:</span>
                <span className="font-medium text-slate-900">
                  ₹{Number(invoice.subtotal).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax ({invoice.taxPercent}%):</span>
                <span className="font-medium text-slate-900">
                  + ₹{Number(invoice.taxAmount).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-sm text-slate-600">
                <span>Discount:</span>
                <span className="font-medium text-emerald-600">
                  - ₹{Number(invoice.discount).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Grand Total:</span>
                <span className="text-xl font-bold tracking-tight text-indigo-600">
                  ₹{Number(invoice.grandTotal).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;