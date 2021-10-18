const { Teacher } = require("../../../models/teacher");
const { createResolver } = require("apollo-resolvers");
const { teacherSignUp, addService, deleteService } = require("../../../services/teacherServices");
const { validateAddServiceInput } = require('../../../validation/serviceValidation')
const { validateId } = require('../../../validation/idValidation');
const teacherCheckAuth = require('../../../middleware/checkAuth');

module.exports = {
  Mutation: {
    signUpTeacher: createResolver(async function (parent, { data }, ctx, info) {
      console.log(data);
      Teacher.validateTeacher(data);
      const teacher = await teacherSignUp(data)
      return teacher;
    }),
    addService: teacherCheckAuth.createResolver(async function (parent, { data }, ctx, info) {
      console.log(data);
      validateAddServiceInput(data);

      const service = await addService(data, ctx.req.user);
      return service;
    }),
    deleteService: teacherCheckAuth.createResolver(async function (parent, { serviceId }, ctx, info) {
      validateId(serviceId);

      const service = await deleteService(serviceId, ctx.req.user);
      return service;
    }),
  },
};