const adminService = require("../service/admin.service")

const adminController = {
    create: async (req, res) => {
        try {
            const body = req.body
            const result = await adminService.createForm(body)
            if (result) {
                return res.status(201).json({
                    status: "success",
                    statusCode: 201,
                    message: "Form created successfully.."
                })
            }
        } catch (error) {
            console.log("Admin create error:", error.message);
            return res.status(500).json({ error: "Internal Error" });
        }
    },
    updateForm: async (req, res) => {
        try {
            console.log(req.params, "prams")
            console.log("body: ", req.body)
            const form = await adminService.updateForm(req.params.id, req.body);
            return res.json({ success: true, status: 200, message: "Form updated successfully.." });
        } catch (error) {
            console.error("ERROR in updateForm:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    deleteForm: async (req, res) => {
        try {
            await adminService.deleteForm(req.params.id);
            return res.json({ success: true, status: 200, message: "Form deleted" });
        } catch (error) {
            console.error("ERROR in deleteForm:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    listForms: async (req, res) => {
        try {
            const forms = await adminService.listForms();
            return res.status(200).json({
                success: true,
                status: 200,
                data: forms
            });
        } catch (error) {
            console.error("ERROR in listForms:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // ------------------------FIELD CRUD ------------------
    addField: async (req, res) => {
        try {
            const form = await adminService.addField(req.params.id, req.body);
            return res.json({ success: true, data: form });
        } catch (error) {
            console.error("ERROR in addField:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    updateField: async (req, res) => {
        try {
            const form = await adminService.updateField(
                req.params.id,
                req.params.fieldId,
                req.body
            );
            return res.json({ success: true, data: form });
        } catch (error) {
            console.error("ERROR in updateField:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    deleteField: async (req, res) => {
        try {
            const form = await adminService.deleteField(
                req.params.id,
                req.params.fieldId
            );
            return res.json({ success: true, data: form });
        } catch (error) {
            console.error("ERROR in deleteField:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    },
    getSubmissions: async (req, res) => {
        try {
            const submissions = await adminService.getSubmissions(req.params.id);
            return res.json({ success: true, data: submissions });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }

};

module.exports = adminController;
