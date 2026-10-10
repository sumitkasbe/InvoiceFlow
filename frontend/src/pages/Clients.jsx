import { useEffect, useState } from "react";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../services/api";

function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    billingAddress: "",
    gstNumber: "",
  });

  const loadClients = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const data = await getClients(searchValue);
      setClients(data.clients);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearch(value);
    loadClients(value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      billingAddress: "",
      gstNumber: "",
    });

    setEditingClient(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      if (editingClient) {
        await updateClient(editingClient._id, formData);
      } else {
        await createClient(formData);
      }

      resetForm();
      loadClients(search);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);

    setFormData({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      billingAddress: client.billingAddress,
      gstNumber: client.gstNumber || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      await deleteClient(id);
      loadClients(search);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Clients
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your clients and their billing information.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition self-start sm:self-auto"
            >
              + Add Client
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name, company or email..."
            value={search}
            onChange={handleSearch}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-sm"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Client Form Card */}
        {showForm && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              {editingClient ? "Edit Client" : "Add Client"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Client Name
                  </label>
                  <input
                    name="name"
                    placeholder="Enter client name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Company
                  </label>
                  <input
                    name="company"
                    placeholder="Enter company name"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Billing Address
                  </label>
                  <textarea
                    name="billingAddress"
                    placeholder="Enter full billing address"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    GST Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    name="gstNumber"
                    placeholder="e.g. 22AAAAA0000A1Z5"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className="w-full sm:w-1/2 px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>

              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                >
                  {editingClient ? "Update Client" : "Create Client"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content Section: Loading, Empty, or Cards */}
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-500 text-sm font-medium">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3" />
            Loading clients...
          </div>
        ) : clients.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">No clients found</h3>
            <p className="mt-1 text-sm text-slate-500">
              Add your first client to start creating invoices.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div
                key={client._id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-base font-semibold text-slate-900">
                      {client.name}
                    </h3>
                    <p className="text-sm font-medium text-indigo-600">
                      {client.company}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="flex items-start gap-1.5">
                      <span className="font-medium text-slate-400 w-16 shrink-0">Email:</span>
                      <span className="break-all">{client.email}</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <span className="font-medium text-slate-400 w-16 shrink-0">Phone:</span>
                      <span>{client.phone}</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <span className="font-medium text-slate-400 w-16 shrink-0">Address:</span>
                      <span className="text-slate-600">{client.billingAddress}</span>
                    </p>
                    {client.gstNumber && (
                      <p className="flex items-start gap-1.5">
                        <span className="font-medium text-slate-400 w-16 shrink-0">GST:</span>
                        <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                          {client.gstNumber}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(client)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(client._id)}
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

export default Clients;