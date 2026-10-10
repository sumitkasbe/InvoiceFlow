import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const getStatusBadge = (status) => {
    const formatted = status ? status.toLowerCase() : "";
    switch (formatted) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "overdue":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="max-w-7xl mx-auto rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of your invoices, payments, and balances
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition hover:shadow-md">
            <h3 className="text-sm font-medium text-slate-500">Total Invoices</h3>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {dashboard?.totalInvoices ?? 0}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition hover:shadow-md">
            <h3 className="text-sm font-medium text-slate-500">Billed Amount</h3>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              ₹{dashboard?.billedAmount?.toLocaleString("en-IN") ?? 0}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition hover:shadow-md">
            <h3 className="text-sm font-medium text-slate-500">Paid Amount</h3>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600">
              ₹{dashboard?.paidAmount?.toLocaleString("en-IN") ?? 0}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition hover:shadow-md">
            <h3 className="text-sm font-medium text-slate-500">Outstanding Amount</h3>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-amber-600">
              ₹{dashboard?.outstandingAmount?.toLocaleString("en-IN") ?? 0}
            </p>
          </div>
        </div>

        {/* Recent Invoices Section */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Invoices
            </h2>
          </div>

          {dashboard?.recentInvoices?.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No invoices found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dashboard?.recentInvoices?.map((invoice) => (
                <div
                  key={invoice._id}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 truncate mt-0.5">
                      {invoice.client?.name || "No Client Specified"}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-semibold text-slate-900 text-sm">
                      ₹{invoice.grandTotal?.toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;