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

      setInvoices(data.invoices);
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
        setClients(data.clients);
      } catch (error) {
        setError(error.message);
      }
    };

    loadClients();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?",
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

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Invoices</h1>

        <button
          className="primary-button"
          onClick={() => navigate("/invoices/create")}
        >
          Create Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="invoice-filters">
        <input
          type="text"
          placeholder="Search invoice number"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={clientFilter}
          onChange={(event) => setClientFilter(event.target.value)}
        >
          <option value="">All Clients</option>

          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
        />

        <button className="primary-button" onClick={loadInvoices}>
          Apply Filters
        </button>
      </div>

      {/* Invoice Count */}
      <p className="invoice-count">Total invoices: {invoices.length}</p>

      {/* Loading */}
      {loading ? (
        <p className="loading-message">Loading invoices...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : invoices.length === 0 ? (
        <p className="empty-message">No invoices found.</p>
      ) : (
        /* Invoice Cards */
        <div className="invoice-grid">
          {invoices.map((invoice) => (
            <div className="invoice-card" key={invoice._id}>
              <div className="invoice-card-header">
                <h3>{invoice.invoiceNumber}</h3>

                <span className={`status ${invoice.status.toLowerCase()}`}>
                  {invoice.status}
                </span>
              </div>

              <p>
                <strong>Client:</strong> {invoice.client.name}
              </p>

              <p>
                <strong>Amount:</strong> ₹{invoice.grandTotal}
              </p>

              <p>
                <strong>Issue Date:</strong>{" "}
                {new Date(invoice.issueDate).toLocaleDateString()}
              </p>

              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(invoice.dueDate).toLocaleDateString()}
              </p>

              <div className="invoice-actions">
                <button className="secondary-button" onClick={() => navigate(`/invoices/${invoice._id}`)}>
                  View
                </button>

                <button className="secondary-button"
                  onClick={() => navigate(`/invoices/${invoice._id}/edit`)}
                >
                  Edit
                </button>

                <button className="danger-button" onClick={() => handleDelete(invoice._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Invoices;
