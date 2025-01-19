// validation.js
const Joi = require("joi");

const schemas = {
  auth: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
  }),

  subscription: Joi.object({
    subscription: Joi.string()
      .valid("starter", "pro", "business")
      .required()
      .messages({
        "any.only": "Subscription must be one of: starter, pro, business",
        "any.required": "Subscription is required",
      }),
  }),

  contact: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .min(9)
      .max(20)
      .pattern(/^\+?[\d\s-]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number can only contain numbers, spaces, dashes and plus sign",
        "string.min": "Phone number must be at least 9 characters long",
        "string.max": "Phone number cannot be longer than 20 characters",
        "any.required": "Phone number is required",
      }),
    favorite: Joi.boolean(),
  }),
};

// Oryginalna funkcja walidacji dla kontaktów
const validateContact = async (req, res, next) => {
  try {
    await schemas.contact.validateAsync(req.body);
    next();
  } catch (err) {
    if (err.details && err.details[0]) {
      return res.status(400).json({
        message: err.details[0].message,
      });
    }
    res.status(400).json({
      message: err.message,
    });
  }
};

// Ogólna funkcja walidacji dla innych schematów
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      message: err.details ? err.details[0].message : err.message,
    });
  }
};

module.exports = {
  validateContact,
  validateAuth: validate(schemas.auth),
  validateSubscription: validate(schemas.subscription),
  schemas,
};
