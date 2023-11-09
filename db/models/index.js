const { teacherModel, teacherSchema } = require("./teacher.model");

function setUpModels(sequelize) {
  teacherModel.init(teacherSchema, teacherModel.config(sequelize));
}

module.exports = setUpModels;
