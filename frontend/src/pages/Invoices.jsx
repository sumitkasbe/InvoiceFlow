import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInvoices, getClients, deleteInvoice } from "../services/api";

function Invoices() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);

  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInvoices({
        search,
        client: clientFilter,
        status: statusFilter,
        fromDate,
        toDate,
      });

      setInvoices(data.invoices || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await getClients();
        setClients(data.clients || []);
      } catch (error) {
        setError(error.message);
      }
    };

    loadClients();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      await deleteInvoice(id);
      loadInvoices();
    } catch (error) {
      setError(error.message);
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Invoices
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create, track, and manage all your client billings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/invoices/create")}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition self-start sm:self-auto"
          >
            + Create Invoice
          </button>
        </div>

        {/* Filters Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search invoice number..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>

            {/* Client Filter */}
            <div>
              <select
                value={clientFilter}
                onChange={(event) => setClientFilter(event.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              >
                <option value="">All Clients</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              >
                <option value="">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            {/* Date Range: From */}
            <div>
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>

            {/* Date Range: To */}
            <div>
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-500">
              Showing <span className="text-slate-900 font-semibold">{invoices.length}</span> invoices
            </span>

            <button
              type="button"
              onClick={loadInvoices}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Invoices List / Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-500 text-sm font-medium">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3" />
            Loading invoices...
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">No invoices found</h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search criteria or create your first invoice.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map((invoice) => (
              <div
                key={invoice._id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-base font-semibold text-slate-900">
                      {invoice.invoiceNumber}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="flex items-start justify-between">
                      <span className="font-medium text-slate-400">Client:</span>
                      <span className="text-slate-900 font-medium text-right truncate pl-2">
                        {invoice.client?.name || "N/A"}
                      </span>
                    </p>
                    <p className="flex items-start justify-between">
                      <span className="font-medium text-slate-400">Total:</span>
                      <span className="font-semibold text-slate-900">
                        ₹{invoice.grandTotal?.toLocaleString("en-IN")}
                      </span>
                    </p>
                    <p className="flex items-start justify-between">
                      <span className="font-medium text-slate-400">Issue Date:</span>
                      <span className="text-slate-700">
                        {invoice.issueDate
                          ? new Date(invoice.issueDate).toLocaleDateString()
                          : "-"}
                      </span>
                    </p>
                    <p className="flex items-start justify-between">
                      <span className="font-medium text-slate-400">Due Date:</span>
                      <span className="text-slate-700">
                        {invoice.dueDate
                          ? new Date(invoice.dueDate).toLocaleDateString()
                          : "-"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/invoices/${invoice._id}/edit`)}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(invoice._id)}
                    className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Invoices;