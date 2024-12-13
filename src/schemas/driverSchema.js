const Joi = require("joi");

const driverSchema = Joi.object({
  body: Joi.object({
    driverId: Joi.string().required(),
    driverRef: Joi.string().required(),
    number: Joi.string().required(),
    code: Joi.string().length(3).required(),
    forename: Joi.string().required(),
    surname: Joi.string().required(),
    dob: Joi.string().isoDate().required(),
    nationality: Joi.string().required(),
    url: Joi.string().uri(),
  }),
});

module.exports = driverSchema;
