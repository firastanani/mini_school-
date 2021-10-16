const { Teacher } = require('../models/teacher');
const { processUpload } = require("../util/forUploadFile/fileUplad");

module.exports.teacherSignUp = async (teacherData) => {
  const existingTeacher = await Teacher.findOne({
    email: teacherData.email,
  });
  if (existingTeacher) {
    const errors = new Error("Teacher already exist");
    errors.code = 400;
    throw errors;
  }
  let uploadFile;
  if (teacherData.image) {
    uploadFile = await processUpload(teacherData.image);
    if (!uploadFile.success) {
      const errors = new Error("Faild uploading file");
      errors.code = 400;
      throw errors;
    }
  }

  let teacher = new Teacher({
    name: teacherData.name,
    password: teacherData.password,
    email: teacherData.email,
    age: teacherData.age,
    imageUrl: uploadFile ? uploadFile.Location : null,
    phoneNumber: teacherData.phoneNumber,
    confirm: true,
  });
  teacher = await teacher.save();

  //await sendEmail(teachertData.email, createUrlConfirmEmail(Teacher._id));
  return teacher;
};
