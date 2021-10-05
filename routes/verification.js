const express = require("express");
const router = express.Router();
const { Teacher } = require("../models/teacher");
const { Student } = require("../models/student");

const jwt = require("jsonwebtoken");
const config = require("config");
router.get("/:token", async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, config.get("jwtPrivateKey"));
    let student = await Student.findById(decoded._id);
    let teacher = await Teacher.findById(decoded._id);

    if (student) {
      res.status(200).send("Your email has been verified");
      await student.updateOne({ _id: student._id }, { confirm: true});
      await student.save();
    } else {
      res.status(500).send("this token is expirein please go and make new account ");
    }


    if (teacher) {
      res.status(200).send("Your email has been verified");
      await teacher.updateOne({ _id: teacher._id }, { confirm: true});
      await teacher.save();
    } else {
      res.status(500).send("this token is expirein please go and make new account ");
    }
    
  } catch (err) {
    console.log(err);
    res.status(500).send("server error!!!");
  }
});

module.exports = router;
