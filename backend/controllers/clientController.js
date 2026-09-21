const Client = require("../models/Client");
const Invoice = require("../models/Invoice");

const createClient = async (req, res) => {
    try {
        const {
            name,
            company,
            email,
            phone,
            billingAddress,
            gstNumber
        } = req.body;

        // 1. Check required fields
        if (!name || !company || !email || !phone || !billingAddress) {
            return res.status(400).json({
                message: "Name, company, email, phone and billing address are required"
            });
        }

        // 2. Create client
        const client = await Client.create({
            user: req.userId,
            name,
            company,
            email,
            phone,
            billingAddress,
            gstNumber
        });

        // 3. Send response
        res.status(201).json({
            message: "Client created successfully",
            client
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// const getClients = async (req, res) => {
//     try {
//         const clients = await Client.find({
//             user: req.userId
//         }).sort({ createdAt: -1 });

//         res.status(200).json({
//             clients
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// };

// or for searching

const getClients = async (req, res) => {
    try {
        const search = req.query.search || "";

        const clients = await Client.find({
            user: req.userId,
            $or: [
                { name: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({
            clients
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getClientById = async (req, res) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.status(200).json({
            client
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const updateClient = async (req, res) => {
    try {
        const {
            name,
            company,
            email,
            phone,
            billingAddress,
            gstNumber
        } = req.body;

        const client = await Client.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
            {
                name,
                company,
                email,
                phone,
                billingAddress,
                gstNumber
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.status(200).json({
            message: "Client updated successfully",
            client
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const deleteClient = async (req, res) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        const invoiceExists = await Invoice.exists({
            client: req.params.id,
            user: req.userId
        });

        if (invoiceExists) {
            return res.status(400).json({
                message: "Cannot delete client because invoices exist for this client"
            });
        }

        await Client.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        res.status(200).json({
            message: "Client deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
};