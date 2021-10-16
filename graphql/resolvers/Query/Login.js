const { validateLoginInput } = require("../../../validation/loginValidation");
const { loginServices } = require('../../../services/login-logOutServices');
module.exports = {
  Query: {
    login: async function (parent, { data }, ctx, info) {
      console.log(data);
      validateLoginInput(data);

      const authData = await loginServices(data);

      return authData
    },
  },
};