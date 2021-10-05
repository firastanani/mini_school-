const { Student } = require("../models/student");
const { processUpload } = require("../util/forUploadFile/fileUplad");


module.exports.studentSignUp = async (studentData) => {
  const existingStudent = await Student.findOne({
    email: studentData.email,
  });
  if (existingStudent) {
    const errors = new Error("Student already exist");
    errors.code = 400;
    throw errors;
  }
  let uploadFile;
  if (studentData.image) {
    uploadFile = await processUpload(studentData.image);
    if (!uploadFile.success) {
      const errors = new Error("Faild uploading file");
      errors.code = 400;
      throw errors;
    }
  }

  let student = new Student({
    name: studentData.name,
    password: studentData.password,
    email: studentData.email,
    age: studentData.age,
    imageUrl: uploadFile ? uploadFile.Location : null,
    phoneNumber: studentData.phoneNumber,
    confirm: true,
  });
  student = await student.save();

  //await sendEmail(teachertData.email, createUrlConfirmEmail(Teacher._id));
  return student;
};
