const { Model, DataTypes } = require("sequelize");

const TEACHER_TABLE = "teachers";

const teacherSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  titles: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

class teacherModel extends Model {
  static associate(models) {}

  static config(sequelize) {
    return {
      sequelize,
      modelName: "teacher",
      tableName: TEACHER_TABLE,
      timestamps: false,
    };
  }
}

module.exports = { teacherModel, teacherSchema, TEACHER_TABLE };
