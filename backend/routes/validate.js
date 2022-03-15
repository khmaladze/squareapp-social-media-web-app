const Joi = require("joi");

const authSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  authSchema,
};
