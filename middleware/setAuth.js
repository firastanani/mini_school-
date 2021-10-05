const jwt = require("jsonwebtoken");
const { Teacher } = require("../models/teacher");
const { Student } = require("../models/student");
const config = require("config");
const { STUDENT, TEACHER } = require("../config/serverConstant");

const setAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    let user;
    switch (decoded.type) {
      case STUDENT:
        const student = await Student.findOne({
          _id: decoded._id,
          tokens: token,
        });
        user = student;
        break;

      case TEACHER:
        const teacher = await Teacher.findOne({
          _id: decoded._id,
          tokens: token,
        });
        user = teacher;
        break;
    }

    if (!user) {
      req.isAuth = false;
      return next();
    }

    req.user = user;
    req.isAuth = true;
    req.token = token;
    req.type = decoded.type;
    return next();
  } catch (e) {
    req.isAuth = false;
    return next();
  }
};
module.exports = setAuth;
