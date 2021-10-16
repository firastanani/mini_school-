const { Student } = require("../../../models/student");
const { createResolver } = require("apollo-resolvers");
const { studentSignUp } = require("../../../services/studentServices");

module.exports = {
  Mutation: {
    signUpStudent: createResolver(async function (parent, { data }, ctx, info) {
      Student.validateStudent(data);
      const student = await studentSignUp(data)
      return student;
    }),

  },
};
