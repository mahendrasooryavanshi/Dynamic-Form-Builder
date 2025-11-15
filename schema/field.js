const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true,
    },

    type: {
        type: String,
        enum: ["text", "textarea", "number", "email", "date", "checkbox", "radio", "select"],
        required: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    required: {
        type: Boolean,
        default: false,
    },

    // For select, radio, checkbox
    options: [
        {
            label: String,
            value: String,

            // Nested Fields when option selected
            conditionalFields: [
                {
                    label: String,
                    type: {
                        type: String,
                        enum: ["text", "textarea", "number", "email", "date", "checkbox"],
                    },
                    name: String,
                    required: Boolean,
                    order: Number,
                },
            ],
        },
    ],

    // Validation rules per field
    validation: {
        min: Number,
        max: Number,
        regex: String,
    },

    order: {
        type: Number,
        required: true,
    },
});

module.exports = FieldSchema;
