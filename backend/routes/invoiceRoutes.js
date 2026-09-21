const express = require("express");

const { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice, getDashboard } = require("../controllers/invoiceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createInvoice);
router.get("/", protect, getInvoices);
router.get("/dashboard", protect, getDashboard);
router.get("/:id", protect, getInvoiceById);
router.put("/:id", protect, updateInvoice);
router.delete("/:id", protect, deleteInvoice);

module.exports = router;