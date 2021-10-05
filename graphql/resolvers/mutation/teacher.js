const { Teacher } = require("../../../models/teacher");
const { createResolver } = require("apollo-resolvers");
const {teacherSignUp} = require("../../../services/teacherServices");

module.exports = {
  Mutation: {
    signUpTeacher: createResolver(async function (parent, { data }, ctx, info) {
      console.log(data);
      Teacher.validateTeacher(data);
      const teacher = await teacherSignUp(data)
      return teacher;
    }),
    
  },
};
