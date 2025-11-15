const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin.controller.js");
const adminAuth = require("../middleware/adminAuth.middleware");
const { validateCreateForm, validateUpdateForm } = require("../validation/form.validator.js");
// BASIC AUTH PROTECTION
router.use(adminAuth)

// FORM CURD
router.post("/forms", validateCreateForm, adminController.create);
router.put("/forms/:id", validateUpdateForm, adminController.updateForm);
router.delete("/forms/:id", adminController.deleteForm);
router.get("/forms", adminController.listForms);

//FIELD CRUD
router.post("/forms/:id/fields", adminController.addField);
router.put("/forms/:id/fields/:fieldId", adminController.updateField);
router.delete("/forms/:id/fields/:fieldId", adminController.deleteField);

//Fetch all submited form by form id
router.get("/forms/:id/submissions", adminController.getSubmissions);

module.exports = router;
