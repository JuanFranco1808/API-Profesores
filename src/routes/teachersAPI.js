//Librerias externas
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const moment = require("moment-timezone");

//Modulos internos/funciones importadas
const { readFile, writeFile } = require("../files");
const { models } = require("../libs/sequelize");

//Variables globales
const FILE_NAME = "./db/teachers.txt";
const FILE_NAME_DB2 = "./db/access.txt";

//RUTAS API
//Obtener todo el listado de profesores
router.get("/", async (req, res) => {
  const filter = req.query.subject;
  /* let data = readFile(FILE_NAME);
  if (filter) {
    data = data.filter((data) =>
      data.subject.toLowerCase().includes(filter.toLowerCase())
    );
  } */
  let data = await models.teacher.findAll();
  if (filter) {
    data = await models.teacher.findAll({
      where: { subject: filter },
    });
  }
  res.send(data);
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    ` ${req.method}` +
    " APIListadoProfesores" +
    ` ${req.path}`;
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Obtener un profesor por ID
router.get("/:teacherID", async (req, res) => {
  const id = req.params.teacherID;
  /* const teachers = readFile(FILE_NAME);
  const teacherFound = teachers.find((teachers) => teachers.id == id);
  if (!teacherFound) {
    res.status(404).json({ message: "No se encuentra el profesor" });
    return;
  } */
  //CONSULTA CON SEQUELIZE
  let teacherFound = await models.teacher.findAll({
    where: {
      id: id,
    },
  });
  res.json({ teacher: teacherFound });
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    ` ${req.method}` +
    " APIProfesorPorId" +
    ` ${req.path}`;
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Crear un profesor
router.post("/", async (req, res) => {
  try {
    /* const data = readFile(FILE_NAME);
    const newTeacher = req.body;
    newTeacher.id = uuidv4();
    Joi.assert(newTeacher.name, Joi.string().min(1));
    Joi.assert(newTeacher.lastname, Joi.string().min(1));
    Joi.assert(newTeacher.age, Joi.number());
    Joi.assert(newTeacher.gender, Joi.string().min(1).max(1));
    Joi.assert(newTeacher.subject, Joi.string().min(1));
    Joi.assert(newTeacher.active, Joi.boolean());
    Joi.assert(newTeacher.institution, Joi.string().min(1));
    Joi.assert(newTeacher.titles, Joi.string().min(1));
    data.push(newTeacher);
    writeFile(FILE_NAME, data); */

    const newTeacher = await models.teacher.create(req.body);
    res.json({ message: "El profesor fue creada con exito" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error al crear el profesor" });
  }
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    ` ${req.method}` +
    " APICrearProfesor" +
    ` ${req.path}`;
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Actualizar la informacion de un profesor
router.put("/:teacherID", (req, res) => {
  const id = req.params.teacherID;
  const teachers = readFile(FILE_NAME);
  const teacherIndex = teachers.findIndex((teachers) => teachers.id == id);
  if (teacherIndex < 0) {
    res.status(404).json({ message: "No se encuentra el profesor" });
    return;
  }
  let teacher = teachers[teacherIndex];
  teacher = { ...teacher, ...req.body };
  try {
    Joi.assert(teacher.name, Joi.string().min(1));
    Joi.assert(teacher.lastname, Joi.string().min(1));
    Joi.assert(teacher.age, Joi.number());
    Joi.assert(teacher.gender, Joi.string().min(1).max(1));
    Joi.assert(teacher.subject, Joi.string().min(1));
    Joi.assert(teacher.active, Joi.boolean());
    Joi.assert(teacher.institution, Joi.string().min(1));
    Joi.assert(teacher.titles, Joi.string().min(1));
    teachers[teacherIndex] = teacher;
    writeFile(FILE_NAME, teachers);
    res.json({ teacher: teacher });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error al actualizar la información" });
  }
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    ` ${req.method}` +
    " APIActualizarProfesor" +
    ` ${req.path}`;
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Eliminar un profesor
router.delete("/:teacherID", (req, res) => {
  const id = req.params.teacherID;
  /* const teachers = readFile(FILE_NAME);
  const teacherIndex = teachers.findIndex((teachers) => teachers.id == id);
  if (teacherIndex < 0) {
    res.status(404).json({ message: "No se encuentra el profesor" });
    return;
  }
  teachers.splice(teacherIndex, 1);
  writeFile(FILE_NAME, teachers); */

  models.teacher.destroy({
    where: {
      id: id,
    },
  });
  res.json({ message: "Profesor eliminado" });
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    ` ${req.method}` +
    " APIEliminarProfesor" +
    ` ${req.path}`;
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

module.exports = router;
