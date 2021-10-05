const { Student } = require("../../models/student");
const { Teacher } = require("../../models/teacher");

module.exports = async function deleteOldDocument(jk) {
//   var dt = new Date(Date.now());
//   dt.setDate(dt.getDate() - 1);
var dt = new Date(Date.now());
dt.setSeconds(dt.getSeconds() - 120);
  const afterDays = dt;
  await Student.deleteMany({ 'createdAt': { $lte: afterDays } , 'confirm' : false});
  await Teacher.deleteMany({ 'createdAt': { $lte: afterDays } , 'confirm' : false});

  setTimeout(async function() {
    await deleteOldDocument();
}, 5000);   };


