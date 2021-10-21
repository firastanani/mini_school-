const { getAllServicesForTeacher } = require("../../../services/teacherServices");
const teacherCheckAuth = require('../../../middleware/checkAuth');

module.exports = {
  Query: {
    getMyServices: teacherCheckAuth.createResolver(async function (parent, arg, ctx, info) {
      const teacherServices = await getAllServicesForTeacher(ctx.req.user._id);
      return teacherServices;
    }),
  },
};