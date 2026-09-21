require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8000;

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);

app.get("/", (req,res) => {
    res.send("InvoiceFlow API is running!");
})

app.listen(port, () => {
    console.log(`Express Server running on port ${port}`);
});
