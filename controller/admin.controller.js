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
            const form = await adminService.updateForm(req.params.id, req.body);
            if (!form) {
                return res.status(404).json({
                    status: 404,
                    message: "Form id is not found."
                })
            }
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
            let page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;

            // Ensure valid numbers
            if (page < 1) page = 1;
            if (limit < 1) limit = 10;

            const skip = (page - 1) * limit;
            let query = {}
            let projection = { __v: -1, updatedAt: -1 }
            const forms = await adminService.listForms(query, projection);
            // Get total count
            const total = await adminService.countForms(query);

            return res.status(200).json({
                status: 200,
                success: true,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit: limit,
                totalForms: total,
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
            let body = req.body
            let formId = req.params.id
            const form = await adminService.addField(formId, req.body);
            if (!form) {
                return res.status(404).json({
                    success: false,
                    message: "Form is not found.",
                    status: 404
                });
            }
            return res.status(201).json({
                success: true,
                message: "Field added successfully",
                data: form
            });
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

            const formId = req.params.id;

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const { submissions, total } = await adminService.getSubmissions(formId, skip, limit);

            if (!submissions) {
                return res.status(404).json({
                    success: true,
                    status: 404,
                    message: "Invalid form id.",

                });
            }
            return res.status(200).json({
                success: true,
                status: 200,
                message: "Submitted form list",
                totalSubmissions: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                pageSize: limit,
                data: submissions
            });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }

};

module.exports = adminController;
