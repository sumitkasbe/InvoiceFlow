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

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="page-container">
      <h1>Dashboard</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Invoices</h3>
          <p>{dashboard.totalInvoices}</p>
        </div>

        <div className="dashboard-card">
          <h3>Billed Amount</h3>
          <p>₹{dashboard.billedAmount}</p>
        </div>

        <div className="dashboard-card">
          <h3>Paid Amount</h3>
          <p>₹{dashboard.paidAmount}</p>
        </div>

        <div className="dashboard-card">
          <h3>Outstanding Amount</h3>
          <p>₹{dashboard.outstandingAmount}</p>
        </div>
      </div>

      <div className="recent-invoices">
        <h2>Recent Invoices</h2>

        {dashboard.recentInvoices.length === 0 ? (
          <p>No invoices found.</p>
        ) : (
          dashboard.recentInvoices.map((invoice) => (
            <div className="recent-invoice" key={invoice._id}>
              <div>
                <strong>{invoice.invoiceNumber}</strong>

                <p>{invoice.client?.name}</p>
              </div>

              <div>
                <strong>₹{invoice.grandTotal}</strong>

                <p>{invoice.status}</p>
              </div>
            </div>
          ))    
        )}
      </div>
    </div>
  );
}

export default Dashboard;
