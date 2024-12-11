const Joi = require("joi");
const { AppError } = require("./errorHandler");

const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false, // incluir todos los errores
      allowUnknown: true, // ignorar propiedades desconocidas
      stripUnknown: true, // eliminar propiedades desconocidas
    };

    const validateData = {
      body: req.body,
      query: req.query,
      params: req.params,
    };

    const { error } = schema.validate(validateData, validationOptions);

    if (error) {
      const validationErrors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return next(
        new AppError(400, {
          message: "Validation Error",
          errors: validationErrors,
        })
      );
    }

    next();
  };
};

// Esquemas de validación comunes
const commonSchemas = {
  pagination: Joi.object({
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      sortBy: Joi.string(),
      order: Joi.string().valid("asc", "desc"),
    }),
  }),

  idParam: Joi.object({
    params: Joi.object({
      id: Joi.string().required(),
    }),
  }),
};

module.exports = {
  validate,
  commonSchemas,
};
