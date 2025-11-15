const mongoose = require("mongoose");
const FieldSchema = require("./field");

const FormSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        version: {
            type: Number,
            default: 1,
        },

        fields: [FieldSchema], // Embedding all form fields
    },
    { timestamps: true }
);

module.exports = mongoose.model("Form", FormSchema);
