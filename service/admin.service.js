
const Form = require("../schema/form");
const Submission = require("../schema/submission")
module.exports = {
    // ---------------- FORM CRUD ------------------
    createForm: async (data) => {
        try {
            return await Form.create(data);
        } catch (error) {
            return false
        }
    },

    updateForm: async (formId, data) => {
        try {
            return await Form.findByIdAndUpdate(formId, data, {
                new: true,
                runValidators: true
            });
        } catch (error) {
            return false
        }
    },

    deleteForm: async (formId) => {
        try {
            return await Form.findByIdAndDelete(formId);
        } catch (error) {
            return false
        }
    },

    listForms: async (filter = {}) => {
        try {
            return await Form.find(filter).sort({ createdAt: -1 });
        } catch (error) {
            return false;
        }
    },
    countForms: async (query) => {
        try {
            return await Form.countDocuments(query)
        } catch (error) {
            return false;
        }
    },
    // --------------- FIELD CRUD -------------------
    addField: async (formId, fieldData) => {
        try {
            const form = await Form.findById(formId);
            if (!form) {
                return false
            }
            if (Array.isArray(fieldData.fields)) {
                form.fields.push(...fieldData.fields); // spread push
            }
            await form.save();
            return form;
        } catch (error) {
            return false
        }
    },

    updateField: async (formId, fieldId, fieldData) => {
        const form = await Form.findById(formId);
        const field = form.fields.id(fieldId);
        if (!form || !field) {
            return false;
        }
        Object.assign(field, fieldData);
        await form.save();
        return form;
    },

    deleteField: async (formId, fieldId) => {
        try {
            const form = await Form.findById(formId);
            if (!form) return false;
            form.fields.id(fieldId).remove();
            await form.save();
            return form;
        } catch (error) {
            return false
        }
    },
    getSubmissions: async (formId, skip, limit) => {
        try {
            const total = await Submission.countDocuments({ formId });

            const submissions = await Submission.find({ formId })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            return { submissions, total };
        } catch (error) {
            return false
        }
    }
};
