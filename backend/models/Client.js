const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    billingAddress: {
      type: String,
      required: true,
      trim: true,
    },

    gstNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
