const Invoice = require("../models/Invoice");
const Client = require("../models/Client");

const updateOverdueStatus = async (invoice) => {
    const today = new Date();

    if (
        invoice.status === "Unpaid" &&
        new Date(invoice.dueDate) < today
    ) {
        invoice.status = "Overdue";
        await invoice.save();
    }

    return invoice;
};

const createInvoice = async (req, res) => {
  try {
    const {
      client,
      items,
      taxPercent = 0,
      discount = 0,
      issueDate,
      dueDate,
      status = "Draft",
    } = req.body;

    // 1. Basic validation
    if (!client || !items || items.length === 0 || !issueDate || !dueDate) {
      return res.status(400).json({
        message: "Client, items, issue date and due date are required",
      });
    }

    // 2. Check that the client belongs to the logged-in user
    const existingClient = await Client.findOne({
      _id: client,
      user: req.userId,
    });

    if (!existingClient) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    // 3. Calculate item amounts
    const calculatedItems = items.map((item) => {
      const amount = item.quantity * item.rate;

      return {
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount,
      };
    });

    // 4. Calculate subtotal
    const subtotal = calculatedItems.reduce(
      (total, item) => total + item.amount,
      0,
    );

    // 5. Calculate tax
    const taxAmount = (subtotal * taxPercent) / 100;

    // 6. Calculate grand total
    const grandTotal = subtotal + taxAmount - discount;

    // 7. Generate invoice number
    const currentYear = new Date().getFullYear();

    const lastInvoice = await Invoice.findOne({
      user: req.userId,
      invoiceNumber: {
        $regex: `^INV-${currentYear}-`,
      },
    }).sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.split("-")[2]);

      nextNumber = lastNumber + 1;
    }

    const invoiceNumber = `INV-${currentYear}-${String(nextNumber).padStart(
      3,
      "0",
    )}`;

    // 8. Create invoice
    const invoice = await Invoice.create({
      user: req.userId,
      client,
      invoiceNumber,
      items: calculatedItems,
      taxPercent,
      discount,
      subtotal,
      taxAmount,
      grandTotal,
      issueDate,
      dueDate,
      status,
    });

    res.status(201).json({
      message: "Invoice created successfully",
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// const getInvoices = async (req, res) => {
//   try {
//     const invoices = await Invoice.find({
//       user: req.userId,
//     })
//       .populate("client", "name company email")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       invoices,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// get invoice with search functionality
const getInvoices = async (req, res) => {
  try {
    const {
      search = "",
      client = "",
      status = "",
      fromDate = "",
      toDate = "",
    } = req.query;

    const filter = {
      user: req.userId,
    };

    // Search by invoice number
    if (search) {
      filter.invoiceNumber = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by client
    if (client) {
      filter.client = client;
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by issue date
    if (fromDate || toDate) {
      filter.issueDate = {};

      if (fromDate) {
        filter.issueDate.$gte = new Date(fromDate);
      }

      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);

        filter.issueDate.$lte = endDate;
      }
    }
    const invoices = await Invoice.find(filter)
      .populate("client", "name company email")
      .sort({ createdAt: -1 });

    for (const invoice of invoices) {
      await updateOverdueStatus(invoice);
    }

    res.status(200).json({
      invoices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.userId,
    }).populate("client", "name company email");
    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    await updateOverdueStatus(invoice);

    res.status(200).json({
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const {
      client,
      items,
      taxPercent = 0,
      discount = 0,
      issueDate,
      dueDate,
      status,
    } = req.body;

    // 1. Basic validation
    if (!client || !items || items.length === 0 || !issueDate || !dueDate) {
      return res.status(400).json({
        message: "Client, items, issue date and due date are required",
      });
    }

    // 2. Check that the client belongs to the logged-in user
    const existingClient = await Client.findOne({
      _id: client,
      user: req.userId,
    });

    if (!existingClient) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    // 3. Recalculate item amounts
    const calculatedItems = items.map((item) => {
      const amount = item.quantity * item.rate;

      return {
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount,
      };
    });

    // 4. Recalculate subtotal
    const subtotal = calculatedItems.reduce(
      (total, item) => total + item.amount,
      0,
    );

    // 5. Recalculate tax
    const taxAmount = (subtotal * taxPercent) / 100;

    // 6. Recalculate grand total
    const grandTotal = subtotal + taxAmount - discount;

    // 7. Update invoice
    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      {
        client,
        items: calculatedItems,
        taxPercent,
        discount,
        subtotal,
        taxAmount,
        grandTotal,
        issueDate,
        dueDate,
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("client", "name company email");

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      message: "Invoice updated successfully",
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getDashboard = async (req, res) => {
    try {
        const invoices = await Invoice.find({
            user: req.userId
        }).sort({ createdAt: -1 });

        for (const invoice of invoices) {
            await updateOverdueStatus(invoice);
        }

        const totalInvoices = invoices.length;

        const billedAmount = invoices.reduce(
            (total, invoice) => total + invoice.grandTotal,
            0
        );

        const paidAmount = invoices
            .filter((invoice) => invoice.status === "Paid")
            .reduce(
                (total, invoice) => total + invoice.grandTotal,
                0
            );

        const outstandingAmount = invoices
            .filter(
                (invoice) =>
                    invoice.status === "Unpaid" ||
                    invoice.status === "Overdue"
            )
            .reduce(
                (total, invoice) => total + invoice.grandTotal,
                0
            );

        const recentInvoices = invoices.slice(0, 5);

        res.status(200).json({
            totalInvoices,
            billedAmount,
            paidAmount,
            outstandingAmount,
            recentInvoices
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getDashboard
};
