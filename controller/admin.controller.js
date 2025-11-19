const form = require("../schema/form");
const adminService = require("../service/admin.service")
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

const adminController = {
    create: async (req, res) => {
        console.log("Create form api is called :controller is working")
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
            console.log("Return response from backend: ", result)
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

    formDetails: async (req, res) => {
        try {
            const form = await adminService.formById(req.params.id);
            if (!form) {
                return res.status(404).json({
                    status: 404,
                    message: "Form id is not found."
                })
            }
            return res.json({
                success: true,
                status: 200,
                message: "Form details.",
                data: form
            });
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
        console.log("--------------Forms list api is called-----------")
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
            if (form && total) {
                return res.status(200).json({
                    status: 200,
                    success: true,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                    limit: limit,
                    totalForms: total,
                    data: forms
                });
            }
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
            if (form) {
                return res.json({ success: true, data: form });
            } else {
                return false;
            }
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
    },

    dashbord: async (req, res) => {
        console.log("Dashboard controller is working")
        try {
            const totalFroms = await adminService.countForms()
            const totalSubmission = await adminService.totalSumission()
            console.log(totalFroms, totalSubmission, ">>>>>>>>> ttotalSubmission")
            return res.status(200).json({
                status: 200,
                message: "success",
                data: { totalFroms, totalSubmission }
            })
        } catch (error) {
            console.log("error in server:", error.message)
            return res.status(500).json({ success: false, error: error.message });
        }
    },
    exportAllSubmissionsExcel: async (req, res) => {
        try {
            const submissions = await adminService.getAllSubmissions();

            if (!submissions?.length) {
                return res.status(400).json({
                    success: false,
                    message: "No submissions available to export"
                });
            }

            // Create workbook
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("All Submissions");

            sheet.columns = [
                { header: "Submission ID", key: "_id", width: 30 },
                { header: "Form Title", key: "formTitle", width: 30 },
                { header: "Form ID", key: "formId", width: 30 },
                { header: "Answers", key: "answers", width: 60 },
                { header: "Created At", key: "createdAt", width: 25 }
            ];

            submissions.forEach((sub) => {
                sheet.addRow({
                    _id: sub._id.toString(),
                    formTitle: sub.formId?.title || "N/A",
                    formId: sub.formId?._id?.toString() || "N/A",
                    answers: JSON.stringify(sub.answers),
                    createdAt: sub.createdAt
                });
            });

            // -----------------------------------------------------
            // 🔥 DYNAMIC FILE NAME GENERATION
            // -----------------------------------------------------

            let dynamicName = req.query.filename || "all-submissions";
            dynamicName = dynamicName.replace(/\s+/g, "-").toLowerCase(); // cleanup name

            const fileName = `${dynamicName}-${Date.now()}.xlsx`;

            // -----------------------------------------------------
            // 🔥 DEFINE PATHS
            // -----------------------------------------------------
            const publicDir = path.join(__dirname, "..", "public");
            const excelDir = path.join(publicDir, "excel");

            if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
            if (!fs.existsSync(excelDir)) fs.mkdirSync(excelDir);

            const filePath = path.join(excelDir, fileName);

            // Save Excel
            await workbook.xlsx.writeFile(filePath);

            // Download URL
            const downloadUrl = `${req.protocol}://${req.get("host")}/excel/${fileName}`;

            // Auto delete after 30 seconds
            setTimeout(() => {
                if (fs.existsSync(filePath)) {
                    fs.unlink(filePath, (err) => {
                        if (err) console.error("Delete error:", err);
                        else console.log("Deleted:", fileName);
                    });
                }
            }, 30000);

            return res.json({
                success: true,
                message: "Excel file generated",
                downloadUrl,
                fileName
            });

        } catch (error) {
            console.error("Excel Export Error:", error);
            res.status(500).json({
                success: false,
                message: "Something went wrong while generating Excel",
                error: error.message
            });
        }
    }
};

module.exports = adminController;
