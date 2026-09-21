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
    <div className="page-container clients-page">

      <div className="page-header">
        <div>
          <h1>Clients</h1>
          <p className="page-subtitle">
            Manage your clients and their billing information.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          + Add Client
        </button>
      </div>

      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name, company or email"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <div className="client-form-card">

          <h2>
            {editingClient ? "Edit Client" : "Add Client"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">
                <label>Name</label>

                <input
                  name="name"
                  placeholder="Enter client name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company</label>

                <input
                  name="company"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>

                <input
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Billing Address</label>

                <textarea
                  name="billingAddress"
                  placeholder="Enter billing address"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  required
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>GST Number</label>

                <input
                  name="gstNumber"
                  placeholder="Optional"
                  value={formData.gstNumber}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="form-actions">

              <button
                type="submit"
                className="primary-button"
              >
                {editingClient
                  ? "Update Client"
                  : "Create Client"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {loading ? (
        <p className="loading-message">Loading clients...</p>
      ) : clients.length === 0 ? (
        <div className="empty-state">
          <h3>No clients found</h3>
          <p>Add your first client to get started.</p>
        </div>
      ) : (
        <div className="clients-grid">

          {clients.map((client) => (
            <div className="client-card" key={client._id}>

              <div className="client-card-header">
                <div>
                  <h3>{client.name}</h3>
                  <p>{client.company}</p>
                </div>
              </div>

              <div className="client-info">

                <p>
                  <strong>Email:</strong> {client.email}
                </p>

                <p>
                  <strong>Phone:</strong> {client.phone}
                </p>

                <p>
                  <strong>Address:</strong> {client.billingAddress}
                </p>

                {client.gstNumber && (
                  <p>
                    <strong>GST:</strong> {client.gstNumber}
                  </p>
                )}

              </div>

              <div className="client-actions">

                <button
                  className="secondary-button"
                  onClick={() => handleEdit(client)}
                >
                  Edit
                </button>

                <button
                  className="danger-button"
                  onClick={() => handleDelete(client._id)}
                >
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

export default Clients;