const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true,
        },

        answers: {
            type: Object,
            required: true,
        },

        // If you want schema versioning
        formVersion: {
            type: Number,
            required: false,
        },

        submittedAt: {
            type: Date,
            default: Date.now,
        },

        ip: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Submission", SubmissionSchema);
