const Joi = require("joi");

// ---------------------------------------------
// CONDITIONAL FIELDS (Nested)
// ---------------------------------------------
const conditionalFieldSchema = Joi.object({
    label: Joi.string().required().messages({
        "string.base": "Conditional field label must be a string",
        "any.required": "Conditional field label is required",
    }),

    type: Joi.string()
        .valid("text", "textarea", "number", "email", "date", "checkbox")
        .required()
        .messages({
            "any.only":
                "Conditional field type must be one of: text, textarea, number, email, date, checkbox",
            "any.required": "Conditional field type is required",
        }),

    name: Joi.string().required().messages({
        "any.required": "Conditional field name is required",
    }),

    required: Joi.boolean(),

    order: Joi.number().required().messages({
        "any.required": "Conditional field order is required",
        "number.base": "Conditional field order must be a number",
    }),
});

// ---------------------------------------------
// FIELD SCHEMA (Main Fields)
// ---------------------------------------------
const fieldSchema = Joi.object({
    label: Joi.string().required().messages({
        "string.base": "Field label must be a string",
        "any.required": "Field label is required",
    }),

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
        .required()
        .messages({
            "any.only":
                "Field type must be one of: text, textarea, number, email, date, checkbox, radio, select",
            "any.required": "Field type is required",
        }),

    name: Joi.string().required().messages({
        "any.required": "Field name is required",
    }),

    required: Joi.boolean(),

    order: Joi.number().required().messages({
        "any.required": "Order is required",
        "number.base": "Order must be a valid number",
    }),

    options: Joi.array().items(
        Joi.object({
            label: Joi.string().required().messages({
                "any.required": "Option label is required",
            }),
            value: Joi.string().required().messages({
                "any.required": "Option value is required",
            }),
            conditionalFields: Joi.array().items(conditionalFieldSchema).optional(),
        })
    ).messages({
        "array.base": "Options must be an array",
    }),

    validation: Joi.object({
        min: Joi.number().messages({
            "number.base": "Validation min must be a number",
        }),
        max: Joi.number().messages({
            "number.base": "Validation max must be a number",
        }),
        regex: Joi.string().messages({
            "string.base": "Validation regex must be a valid string",
        }),
    }).optional(),
});

// ---------------------------------------------
// CREATE FORM SCHEMA
// ---------------------------------------------
const createFormSchema = Joi.object({
    title: Joi.string().required().messages({
        "any.required": "Form title is required",
    }),

    description: Joi.string().allow("").messages({
        "string.base": "Form description must be a string",
    }),

    fields: Joi.array().items(fieldSchema).messages({
        "array.base": "Fields must be an array",
    }),
});

// ---------------------------------------------
// UPDATE FORM SCHEMA
// ---------------------------------------------
const updateFormSchema = Joi.object({
    title: Joi.string().messages({
        "string.base": "Form title must be a string",
    }),

    description: Joi.string().messages({
        "string.base": "Form description must be a string",
    }),

    fields: Joi.array().items(fieldSchema).messages({
        "array.base": "Fields must be an array",
    }),
}).min(1);

// ---------------------------------------------
// Export Validation Middlewares
// ---------------------------------------------
exports.validateCreateForm = (req, res, next) => {
    const { error, value } = createFormSchema.validate(req.body, {
        abortEarly: true,
    });

    if (error) {
        return res.status(422).json({
            success: false,
            status: 422,
            error: "Validation error",
            messaage: error.details.map((e) => e.message)[0],
        });
    }

    req.body = value;
    next();
};

exports.validateUpdateForm = (req, res, next) => {
    const { error, value } = updateFormSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: error.details.map((e) => e.message)
        });
    }

    req.body = value;
    next();
};
