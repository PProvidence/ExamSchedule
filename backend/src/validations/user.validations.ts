import Joi from "joi";

export const loginSchema = Joi.object({
  identifier: Joi.string()
    .trim()
    .required()
    .messages({
      "string.base": "Matric number/Email must be a string",
      "string.empty": "Matric number/Email is required",
      "any.required": "Matric number/Email is required",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
});
