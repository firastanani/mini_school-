const { Student } = require("../../../models/student");
const { createResolver } = require("apollo-resolvers");
const {studentSignUp} = require("../../../services/studentServices");

module.exports = {
  Mutation: {
    signUpStudent: createResolver(async function (parent, { data }, ctx, info) {
      console.log('here');
      console.log(data);
      Student.validateStudent(data);
      const student = await studentSignUp(data)
      return student;
    }),

  },
};
