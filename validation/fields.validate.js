const Joi = require("joi");

// -------------------------------------------------
// CONDITIONAL FIELD (nested)
// -------------------------------------------------
const conditionalFieldSchema = Joi.object({
    label: Joi.string().required(),
    type: Joi.string()
        .valid("text", "textarea", "number", "email", "date", "checkbox")
        .required(),
    name: Joi.string().required(),
    required: Joi.boolean().optional(),
    order: Joi.number().required()
}).unknown(false);

// -------------------------------------------------
// OPTIONS schema
// -------------------------------------------------
const optionSchema = Joi.object({
    label: Joi.string().required(),
    value: Joi.string().required(),
    conditionalFields: Joi.array().items(conditionalFieldSchema).optional()
}).unknown(false);

// -------------------------------------------------
// VALIDATION RULES schema
// -------------------------------------------------
const validationSchema = Joi.object({
    min: Joi.number().optional(),
    max: Joi.number().optional(),
    regex: Joi.string().optional()
}).unknown(false);

// -------------------------------------------------
// SINGLE FIELD SCHEMA
// -------------------------------------------------
const singleFieldSchema = Joi.object({
    label: Joi.string().required(),
    type: Joi.string()
        .valid(
            "text",
            "textarea",
            "number",
            "email",
            "date",
            "checkbox",
            "radio",
            "select"
        )
        .required(),
    name: Joi.string().required(),
    required: Joi.boolean().optional(),
    order: Joi.number().required(),

    options: Joi.array()
        .items(optionSchema)
        .when("type", {
            is: Joi.valid("radio", "select"),
            then: Joi.required().messages({
                "any.required": "Options are required for radio/select fields"
            }),
            otherwise: Joi.forbidden().messages({
                "any.unknown": "Options are not allowed for this field type"
            })
        }),

    validation: validationSchema.optional()
}).unknown(false);

// -------------------------------------------------
// WRAPPER FOR MULTIPLE FIELDS
// -------------------------------------------------
const fieldsWrapperSchema = Joi.object({
    fields: Joi.array().items(singleFieldSchema).min(1).required()
}).unknown(false);

// -------------------------------------------------
// MIDDLEWARE
// -------------------------------------------------
exports.validateCreateFields = (req, res, next) => {
    const { error, value } = fieldsWrapperSchema.validate(req.body, {
        abortEarly: true
    });

    if (error) {
        const err = error.details[0]; // first error only
        const path = err.path;

        let message = "";

        // Build readable structure
        if (path[0] === "fields") {
            const fieldIndex = path[1] !== undefined ? path[1] + 1 : null;
            message += `Field ${fieldIndex}`;

            if (path.includes("options")) {
                const optIndex = path[path.indexOf("options") + 1] + 1;
                message += ` → Option ${optIndex}`;
            }

            if (path.includes("conditionalFields")) {
                const cfIndex =
                    path[path.indexOf("conditionalFields") + 1] + 1;
                message += ` → Conditional Field ${cfIndex}`;
            }

            const last = path[path.length - 1];
            if (typeof last === "string") {
                message += `: ${last} is required`;
            }
        } else {
            message = err.message.replace(/["]/g, "");
        }

        return res.status(422).json({
            success: false,
            error: message
        });
    }
    req.body = value;
    next();
};
