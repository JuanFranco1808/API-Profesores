//Librerias externas
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const moment = require("moment-timezone");
const pdf = require("html-pdf");

//Modulos internos/funciones importadas
const { readFile, writeFile } = require("../files");
const { models } = require("../libs/sequelize");

//Variables globales
const FILE_NAME = "./db/teachers.txt";
const FILE_NAME_DB2 = "./db/access.txt";

//Vistas API
//Listado profesores
router.get("/", async (req, res) => {
  const filter = req.query.subject;
  //let data = readFile(FILE_NAME);
  /* if (filter) {
    data = data.filter((data) =>
      data.subject.toLowerCase().includes(filter.toLowerCase())
    );
  } */

  //CONSULTA CRUDA CON SEQUELIZE
  /* const [data, metadata] = await sequelize.query("SELECT * FROM teachers");
  console.log("Pets: ", data);
  console.log("Metadata: ", metadata); */

  //CONSULTA CON SEQUELIZE
  let data = await models.teacher.findAll();
  if (filter) {
    data = await models.teacher.findAll({
      where: { subject: filter },
    });
  }
  res.render("teachers/list", { teachers: data, count: 1, filter: filter });
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    ` ${req.method}` +
    " ListadoProfesores" +
    ` ${req.path}`;
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Eliminar profesor por ID
router.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  /* const teachers = readFile(FILE_NAME);
  const teacherIndex = teachers.findIndex((teachers) => teachers.id == id);
  if (teacherIndex < 0) {
    res.status(404).json({ ok: false, message: "Teacher not found" });
    return;
  }
  teachers.splice(teacherIndex, 1);
  writeFile(FILE_NAME, teachers); */
  models.teacher.destroy({
    where: {
      id: id,
    },
  });
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    ` ${req.method}` +
    " EliminarProfesor" +
    ` ${req.path}`;
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
  res.redirect("/teachers");
});

//Formulario crear profesores
router.get("/create", (req, res) => {
  res.render("teachers/create");
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    ` ${req.method}` +
    " FormCrearProfesor" +
    ` ${req.path}`;
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Crear profesor y guardarlo
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
    Joi.assert(newTeacher.active, Joi.string().min(1));
    Joi.assert(newTeacher.institution, Joi.string().min(1));
    Joi.assert(newTeacher.titles, Joi.string().min(1));
    console.log(newTeacher);
    data.push(newTeacher);
    writeFile(FILE_NAME, data); */
    const newTeacher = await models.teacher.create(req.body);
    res.redirect("/teachers");
  } catch (error) {
    console.error(error);
    res.json({ message: "Error al crear el profesor" });
  }
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    ` ${req.method}` +
    " CrearProfesor" +
    ` ${req.path}`;
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Crear PDF
router.post("/download/:id", (req, res) => {
  const id = req.params.id;
  let teachers = readFile(FILE_NAME);
  const teacherIndex = teachers.findIndex((teachers) => teachers.id == id);
  if (teacherIndex < 0) {
    res.status(404).json({ ok: false, message: "Teacher not found" });
    return;
  }
  teachers = teachers.filter((teachers) => teachers.id == id);
  teachers = JSON.stringify(teachers, null, 2);
  teachers = `<p>${teachers}<p>`;
  pdf.create(teachers, JSON).toFile(`./Profesor.pdf`, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  });
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    ` ${req.method}` +
    " DescargarProfesor" +
    ` ${req.path}`;
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
  res.redirect("/teachers");
});

module.exports = router;
