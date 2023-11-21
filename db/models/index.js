const { teacherModel, teacherSchema } = require("./teacher.model");
const { userModel, userSchema } = require("./user.model");


function setUpModels(sequelize) {
  teacherModel.init(teacherSchema, teacherModel.config(sequelize));
  userModel.init(userSchema, userModel.config(sequelize));

}

module.exports = setUpModels;
