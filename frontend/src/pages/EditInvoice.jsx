import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInvoiceById, getClients, updateInvoice } from "../services/api";

function EditInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    client: "",
    items: [
      {
        description: "",
        quantity: 1,
        rate: 0,
      },
    ],
    taxPercent: 0,
    discount: 0,
    issueDate: "",
    dueDate: "",
    status: "Draft",
  });

  // Load invoice and clients
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [invoiceData, clientData] = await Promise.all([
          getInvoiceById(id),
          getClients(),
        ]);

        const invoice = invoiceData.invoice;

        setClients(clientData.clients || []);

        setFormData({
          client: invoice.client?._id || "",
          items: invoice.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
          })),
          taxPercent: invoice.taxPercent || 0,
          discount: invoice.discount || 0,
          issueDate: invoice.issueDate ? invoice.issueDate.split("T")[0] : "",
          dueDate: invoice.dueDate ? invoice.dueDate.split("T")[0] : "",
          status: invoice.status || "Draft",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Handle normal inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle item inputs
  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
    const updatedItems = [...formData.items];

    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    };

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  // Add new item
  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: "",
          quantity: 1,
          rate: 0,
        },
      ],
    });
  };

  // Remove item
  const removeItem = (index) => {
    if (formData.items.length === 1) {
      return;
    }

    const updatedItems = formData.items.filter(
      (_, itemIndex) => itemIndex !== index
    );

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  // Submit updated invoice
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await updateInvoice(id, formData);
      navigate(`/invoices/${id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Edit Invoice
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Update details, line items, and terms for this invoice.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/invoices/${id}`)}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel & Back
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              General Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Client
                </label>
                <select
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                >
                  <option value="">Select a Client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name} — {client.company}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Issue Date
                </label>
                <input
                  name="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Due Date
                </label>
                <input
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                >
                  <option value="Draft">Draft</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Line Items Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Invoice Items
              </h2>
              <span className="text-xs text-slate-400">
                {formData.items.length} {formData.items.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Item #{index + 1}
                    </span>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-xs font-medium text-rose-600 hover:text-rose-700 transition"
                      >
                        Remove item
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Description
                      </label>
                      <input
                        name="description"
                        placeholder="Service or product description"
                        value={item.description}
                        onChange={(event) => handleItemChange(index, event)}
                        required
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Quantity
                      </label>
                      <input
                        name="quantity"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={item.quantity}
                        onChange={(event) => handleItemChange(index, event)}
                        required
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Rate (₹)
                      </label>
                      <input
                        name="rate"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.rate}
                        onChange={(event) => handleItemChange(index, event)}
                        required
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition"
            >
              + Add Another Item
            </button>
          </div>

          {/* Tax & Discount Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Adjustments
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tax (%)
                </label>
                <input
                  name="taxPercent"
                  type="number"
                  min="0"
                  value={formData.taxPercent}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Discount (₹)
                </label>
                <input
                  name="discount"
                  type="number"
                  min="0"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/invoices/${id}`)}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving Changes..." : "Update Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditInvoice;