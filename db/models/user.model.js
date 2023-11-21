const { Model, DataTypes } = require("sequelize");

const USER_TABLE = "users";

const userSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

class userModel extends Model {
  static associate(models) {}

  static config(sequelize) {
    return {
      sequelize,
      modelName: "user",
      tableName: USER_TABLE,
      timestamps: false,
    };
  }
}

module.exports = { userModel, userSchema, USER_TABLE };
