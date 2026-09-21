import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvoiceById } from "../services/api";

function InvoiceDetails() {
  const { id } = useParams();

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

  if (loading) {
    return (
      <p className="loading-message">
        Loading invoice...
      </p>
    );
  }

  if (error) {
    return (
      <p className="error-message">
        {error}
      </p>
    );
  }

  return (
    <div className="page-container">

      <div className="invoice-details">

        {/* Header */}
        <div className="invoice-details-header">

          <div>
            <h1>Invoice Details</h1>
            <h2>{invoice.invoiceNumber}</h2>
          </div>

          <span
            className={`status ${invoice.status.toLowerCase()}`}
          >
            {invoice.status}
          </span>

        </div>

        {/* Client Information */}
        <div className="client-info">

          <h2>Client Information</h2>

          <p>
            <strong>Client:</strong>{" "}
            {invoice.client.name}
          </p>

          <p>
            <strong>Company:</strong>{" "}
            {invoice.client.company}
          </p>

        </div>

        {/* Invoice Dates */}
        <div className="invoice-info">

          <div>
            <strong>Issue Date</strong>
            <p>
              {new Date(
                invoice.issueDate
              ).toLocaleDateString()}
            </p>
          </div>

          <div>
            <strong>Due Date</strong>
            <p>
              {new Date(
                invoice.dueDate
              ).toLocaleDateString()}
            </p>
          </div>

        </div>

        {/* Items */}
        <div className="invoice-items">

          <h2>Items</h2>

          {invoice.items.map((item, index) => (
            <div
              className="invoice-item"
              key={index}
            >

              <div>
                <strong>Description</strong>
                <p>{item.description}</p>
              </div>

              <div>
                <strong>Quantity</strong>
                <p>{item.quantity}</p>
              </div>

              <div>
                <strong>Rate</strong>
                <p>₹{item.rate}</p>
              </div>

              <div>
                <strong>Amount</strong>
                <p>₹{item.amount}</p>
              </div>

            </div>
          ))}

        </div>

        {/* Totals */}
        <div className="invoice-totals">

          <p>
            <strong>Subtotal:</strong>{" "}
            ₹{invoice.subtotal}
          </p>

          <p>
            <strong>
              Tax ({invoice.taxPercent}%):
            </strong>{" "}
            ₹{invoice.taxAmount}
          </p>

          <p>
            <strong>Discount:</strong>{" "}
            ₹{invoice.discount}
          </p>

          <h2>
            Grand Total: ₹{invoice.grandTotal}
          </h2>

        </div>

      </div>

    </div>
  );
}

export default InvoiceDetails;