const { Teacher } = require('../models/teacher');
const { Service } = require('../models/Service');
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

module.exports.getService = async (serviceId) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    const errors = new Error("Service to delete not found!!!");
    errors.code = 404;
    throw errors;
  }

  return service;
}

module.exports.addService = async (addServiceData, teacher) => {

  addServiceData.author = teacher._id

  let service = new Service(addServiceData);
  service = await service.save();

  return service;
};

module.exports.deleteService = async (serviceId, teacher) => {

  let service = await this.getService(serviceId);
  if (!(service.author).equals(teacher._id)) {
    const errors = new Error("can't delete others services");
    errors.code = 401;
    throw errors;
  }

  service = await service.remove();

  return service;
};


