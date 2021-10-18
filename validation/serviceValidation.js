const Joi = require("joi");

module.exports.validateAddServiceInput = (addServiceData) => {

  const schema = {
    subject_en: Joi.string().max(30),
    subject_ar: Joi.string().max(30),
    description_en: Joi.string().max(120),
    description_ar: Joi.string().max(120),
    costPerHour: Joi.number().required(),
  };

  const { error } = Joi.object(schema).validate(addServiceData);

  if (error) {
    const errors = new Error("invalid input");
    errors.data = error.details[0].message;
    errors.code = 400;
    throw errors;
  }

};