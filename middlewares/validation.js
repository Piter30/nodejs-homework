const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const validateContact = async (req, res, next) => {
  try {
    await contactSchema.validateAsync(req.body);
    next();
  } catch (err) {
    res.status(400).json({
      message: `missing required ${err.details[0].context.key} field`,
    });
  }
};

module.exports = { validateContact };
