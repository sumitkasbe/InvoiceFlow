import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getClients, createInvoice } from "../services/api";

function CreateInvoice() {
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

  // Load clients
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getClients();

        setClients(data.clients);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

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
      (_, itemIndex) => itemIndex !== index,
    );

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  // Create invoice
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = await createInvoice(formData);

      navigate(`/invoices/${data.invoice._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading clients...</p>;
  }

  return (
    <div className="invoice-form-page">
      <h1>Create Invoice</h1>

      {error && <p className="error-message">{error}</p>}

      <form className="invoice-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Client</label>
          <select
            name="client"
            value={formData.client}
            onChange={handleChange}
            required
          >
            <option value="">Select Client</option>

            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} - {client.company}
              </option>
            ))}
          </select>
        </div>

        <h2>Items</h2>

        {formData.items.map((item, index) => (
          <div className="invoice-item" key={index}>
            <h3>Item {index + 1}</h3>

            <input
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(event) => handleItemChange(index, event)}
              required
            />

            <label>Quantity</label>
            <input
              name="quantity"
              type="number"
              min="1"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(event) => handleItemChange(index, event)}
              required
            />

             <label>Rate</label>
            <input
              name="rate"
              type="number"
              min="0"
              placeholder="Rate"
              value={item.rate}
              onChange={(event) => handleItemChange(index, event)}
              required
            />

            <button
              type="button"
              className="danger-button"
              onClick={() => removeItem(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button type="button" className="secondary-button" onClick={addItem}>
          Add Item
        </button>

        <div className="form-group">
          <label>Tax (%)</label>
          <input
            name="taxPercent"
            type="number"
            min="0"
            value={formData.taxPercent}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Discount</label>
          <input
            name="discount"
            type="number"
            min="0"
            value={formData.discount}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Issue Date</label>
          <input
            name="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Draft">Draft</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? "Creating..." : "Create Invoice"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/invoices")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateInvoice;
