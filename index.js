//Librerias externas
require("dotenv").config();
const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const moment = require("moment-timezone");
const pdf = require("html-pdf");

//Modulos internos/funciones importadas
const { readFile, writeFile } = require("./src/files");

//Variables globales
const app = express();
const FILE_NAME = "./db/teachers.txt";
const FILE_NAME_DB2 = "./db/acess.txt";
const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Motor de plantillas EJS
app.set("views", "./src/views");
app.set("view engine", "ejs");

//Funciones de prueba
app.get("/", (req, res) => {
  res.send("Hola mundo");
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() + " GET" + " Prueba" + " /";
  console.log(newDate);
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Vistas API
//Listado profesores
app.get("/teachers", (req, res) => {
  const filter = req.query.subject;
  let data = readFile(FILE_NAME);
  if (filter != undefined) {
    data = data.filter((data) => data.subject.includes(filter));
  }
  res.render("teachers/list", { teachers: data, count: 1 });
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    " GET" +
    " ListadoProfesores" +
    " /teachers";
  console.log(newDate);
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Eliminar profesor por ID
app.post("/teachers/delete/:id", (req, res) => {
  const id = req.params.id;
  const teachers = readFile(FILE_NAME);
  const teacherIndex = teachers.findIndex((teachers) => teachers.id == id);
  if (teacherIndex < 0) {
    res.status(404).json({ ok: false, message: "Teacher not found" });
    return;
  }
  teachers.splice(teacherIndex, 1);
  writeFile(FILE_NAME, teachers);
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    " POST" +
    " EliminarProfesor" +
    ` /teachers/delete/${id}`;
  console.log(newDate);
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
  res.redirect("/teachers");
});

//Formulario crear profesores
app.get("/teachers/create", (req, res) => {
  res.render("teachers/create");
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    " GET" +
    " FormCrearProfesor" +
    " /teachers/create";
  console.log(newDate);
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Crear profesor y guardarlo
app.post("/teachers", (req, res) => {
  try {
    const data = readFile(FILE_NAME);
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
    writeFile(FILE_NAME, data);
    res.redirect("/teachers");
  } catch (error) {
    console.error(error);
    res.json({ message: "Error al crear el profesor" });
  }
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    " POST" +
    " CrearProfesor" +
    " /teachers";
  console.log(newDate);
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Crear PDF
app.post("/teachers/download/:id", (req, res) => {
  const id = req.params.id;
  let teachers = readFile(FILE_NAME);
  const teacherIndex = teachers.findIndex((teachers) => teachers.id == id);
  if (teacherIndex < 0) {
    res.status(404).json({ ok: false, message: "Teacher not found" });
    return;
  }
  teachers = teachers.filter((teachers) => teachers.id == id);
  teachers = JSON.stringify(teachers, null, 2);
  teachers = `<p>${teachers}<p>`
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
    " POST" +
    " DescargarProfesor" +
    ` /teachers/download/${id}`;
  console.log(newDate);
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
  res.redirect("/teachers");
});

//FUNCIONES CRUD API
//Obtener todo el listado de profesores
app.get("/API/teachers", (req, res) => {
  const data = readFile(FILE_NAME);
  res.send(data);
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    " GET" +
    " APIListadoProfesores" +
    " /teachers/API/teachers";
  console.log(newDate);
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Obtener un profesor por ID
app.get("/API/teachers/:teacherID", (req, res) => {
  const id = req.params.teacherID;
  const teachers = readFile(FILE_NAME);
  const teacherFound = teachers.find((teachers) => teachers.id == id);
  if (!teacherFound) {
    res.status(404).json({ message: "No se encuentra el profesor" });
    return;
  }
  res.json({ teacher: teacherFound });
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    " GET" +
    " APIProfesorPorId" +
    ` /teachers/API/teachers/${id}`;
  console.log(newDate);
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Crear un profesor
app.post("/API/teachers", (req, res) => {
  try {
    const data = readFile(FILE_NAME);
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
    writeFile(FILE_NAME, data);
    res.json({ message: "El profesor fue creada con exito" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error al crear el profesor" });
  }
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    " POST" +
    " APICrearProfesor" +
    " /API/teachers";
  console.log(newDate);
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Actualizar la informacion de un profesor
app.put("/API/teachers/:teacherID", (req, res) => {
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
    " PUT" +
    " APIActualizarProfesor" +
    ` /API/teachers/${id}`;
  console.log(newDate);
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Eliminar un profesor
app.delete("/API/teachers/:teacherID", (req, res) => {
  const id = req.params.teacherID;
  const teachers = readFile(FILE_NAME);
  const teacherIndex = teachers.findIndex((teachers) => teachers.id == id);
  if (teacherIndex < 0) {
    res.status(404).json({ message: "No se encuentra el profesor" });
    return;
  }
  teachers.splice(teacherIndex, 1);
  writeFile(FILE_NAME, teachers);
  res.json({ message: "Profesor eliminado" });
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    " DELETE" +
    " APIEliminarProfesor" +
    ` /API/teachers/${id}`;
  console.log(newDate);
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Puerto de enlace
app.listen(PORT, () => {
  console.log(`${APP_NAME} is running on http://localhost:${PORT}`);
});
