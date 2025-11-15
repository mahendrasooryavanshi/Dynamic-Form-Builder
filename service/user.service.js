const Form = require("../schema/form");
const Submission = require("../schema/submission");

module.exports = {
    // ------------------- GET FORM ---------------------
    getForm: async (formId) => {
        const form = await Form.findById(formId);

        if (!form) throw new Error("Form not found");
        return form;
    },

    // ------------------- SUBMIT FORM ---------------------
    submitForm: async (formId, submittedData, ip) => {
        const form = await Form.findById(formId);

        if (!form) throw new Error("Form not found");

        // Validate field-by-field
        for (const field of form.fields) {
            const value = submittedData[field.name];

            // 1. Check required
            if (field.required && (value === undefined || value === "")) {
                throw new Error(`${field.label} is required`);
            }

            // 2. Type-specific validation
            if (value !== undefined) {
                switch (field.type) {
                    case "number":
                        if (isNaN(value)) throw new Error(`${field.label} must be a number`);
                        break;

                    case "email":
                        if (!/^\S+@\S+\.\S+$/.test(value))
                            throw new Error(`${field.label} must be a valid email`);
                        break;
                }
            }

            // 3. Min/Max validation
            if (field.validation) {
                if (field.validation.min !== undefined && value < field.validation.min)
                    throw new Error(`${field.label} must be >= ${field.validation.min}`);

                if (field.validation.max !== undefined && value > field.validation.max)
                    throw new Error(`${field.label} must be <= ${field.validation.max}`);

                if (field.validation.regex) {
                    const regex = new RegExp(field.validation.regex);
                    if (!regex.test(value))
                        throw new Error(`${field.label} has invalid format`);
                }
            }

            // 4. Conditional fields validation
            if (field.options) {
                const selected = field.options.find(o => o.value === value);

                if (selected && selected.conditionalFields) {
                    for (const cf of selected.conditionalFields) {
                        const cfValue = submittedData[cf.name];

                        if (cf.required && !cfValue)
                            throw new Error(`${cf.label} is required`);
                    }
                }
            }
        }

        // If validation passed → Save submission
        const submission = await Submission.create({
            formId,
            answers: submittedData,
            ip,
        });

        return submission;
    },
};
