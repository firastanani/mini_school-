const { Student } = require('../models/student');
const { Teacher } = require('../models/teacher');
module.exports.loginServices = async (loginInputData) => {

  let user;
  let token;

  user = await Student.findByCredentials(loginInputData.email, loginInputData.password);
  if (user) {
    user.isStudent = true;
    token = user.generateAuthToken();
    return { token: token, user: user };
  }

  user = await Teacher.findByCredentials(loginInputData.email, loginInputData.password);
  if (user) {
    user.isTeacher = true;
    token = user.generateAuthToken();
    return { token: token, user: user };
  }

  const errors = new Error("invalid input");
  errors.data = "email not found";
  errors.code = 400;
  throw errors;

};