const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        rate: {
            type: Number,
            required: true,
            min: 0
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: false
    }
);

const invoiceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true
        },

        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        items: {
            type: [invoiceItemSchema],
            required: true,
            validate: {
                validator: function (items) {
                    return items.length > 0;
                },
                message: "Invoice must contain at least one item"
            }
        },

        taxPercent: {
            type: Number,
            default: 0,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        taxAmount: {
            type: Number,
            required: true,
            min: 0
        },

        grandTotal: {
            type: Number,
            required: true,
            min: 0
        },

        issueDate: {
            type: Date,
            required: true
        },

        dueDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["Draft", "Unpaid", "Paid", "Overdue"],
            default: "Draft"
        }
    },
    {
        timestamps: true
    }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;