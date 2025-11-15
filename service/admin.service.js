const Form = require("../schema/form");

module.exports = {
    // ---------------- FORM CRUD ------------------
    createForm: async (data) => {
        try {
            await Form.create(data);
        } catch (error) {
            return false
        }
    },

    updateForm: async (formId, data) => {
        try {
            await Form.findByIdAndUpdate(formId, data, {
                new: true,
                runValidators: true
            });
        } catch (error) {
            return false
        }
    },

    deleteForm: async (formId) => {
        try {
            await Form.findByIdAndDelete(formId);

        } catch (error) {
            return false
        }
    },

    listForms: async (filter = {}) => {
        return await Form.find(filter).sort({ createdAt: -1 });
    },

    // --------------- FIELD CRUD -------------------
    addField: async (formId, fieldData) => {
        try {
            const form = await Form.findById(formId);
            if (!form) {
                return false
            }
            form.fields.push(fieldData);
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
    getSubmissions: async (formId) => {
        try {
            return await Submission.find({ formId }).sort({ createdAt: -1 });
        } catch (error) {
            return false
        }
    }
};
