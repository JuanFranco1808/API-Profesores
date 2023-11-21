require("dotenv").config();
const { Sequelize } = require("sequelize");
const setUpModels = require("../../db/models");

const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: "localhost",
  dialect: "postgres",
  logging: true,
});

setUpModels(sequelize);

//Sincornizar. No usar en entornos productivos
//sequelize.sync(); 

module.exports = sequelize;
