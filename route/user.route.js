const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");

// get form definition
router.get("/forms/:id", userController.getForm);

// submit form
router.post("/forms/:id/submit", userController.submitForm);

module.exports = router;
