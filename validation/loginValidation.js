const Joi = require("joi");

module.exports.validateLoginInput = (loginInputData) => {

  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email({ tlds: { allow: ["com", "net"] } })
      .regex(/^\w+[\+\.\w-]*@([\w-]+.)*\w+[\w-]*.([a-z]{2,4}|d+)$/i)
      .message("please check your email"),
    password: Joi.string().required(),
  };

  const { error } = Joi.object(schema).validate(loginInputData);

  if (error) {
    const errors = new Error("invalid input");
    errors.data = error.details[0].message;
    errors.code = 400;
    throw errors;
  }

};