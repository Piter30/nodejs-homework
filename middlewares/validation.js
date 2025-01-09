const Joi = require("joi");

const contactSchema = Joi.object({
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
});

const validateContact = async (req, res, next) => {
  try {
    await contactSchema.validateAsync(req.body);
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

module.exports = { validateContact };
