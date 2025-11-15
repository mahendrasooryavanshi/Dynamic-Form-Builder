const userService = require("../service/user.service");

module.exports = {
    getForm: async (req, res) => {
        try {
            const form = await userService.getForm(req.params.id);
            return res.json({ success: true, data: form });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    },

    submitForm: async (req, res) => {
        try {
            const saved = await userService.submitForm(req.params.id, req.body, req.ip);
            return res.status(201).json({ success: true, data: saved });
        } catch (error) {
            console.error("Submit Error:", error.message);
            return res.status(400).json({ success: false, error: error.message });
        }
    }
};
