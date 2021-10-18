const { createResolver } = require('apollo-resolvers');
const { TEACHER } = require("../config/serverConstant");

module.exports = createResolver(
  (parent, args, ctx, error) => {
    if (!ctx.req.isAuth && ctx.req.type == TEACHER) {
      const errors = new Error("Authentication falild");
      errors.code = 401;
      throw errors;
    }
  }
);