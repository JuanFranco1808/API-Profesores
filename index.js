//Librerias externas
require("dotenv").config();
const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

//Modulos internos/funciones importadas
const { readFile, writeFile } = require("./src/files");

//Variables globales
const app = express();
const FILE_NAME = "./db/teachers.txt";
const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Funciones de prueba
app.get("/", (req, res) => {
  res.send("Hola mundo");
});

//FUNCIONES CRUD API
//Obtener todo el listado de profesores
app.get("/teachers", (req, res) => {
  const data = readFile(FILE_NAME);
  res.send(data);
});

//Obtener un profesor por ID
app.get("/teachers/:teacherID", (req, res) => {
  const id = req.params.teacherID;
  const teachers = readFile(FILE_NAME);
  const teacherFound = teachers.find((teachers) => teachers.id == id);
  if (!teacherFound) {
    res.status(404).json({ message: "No se encuentra el profesor" });
    return;
  }
  res.json({ teacher: teacherFound });
});

//Crear un profesor
app.post("/teachers", (req, res) => {
  try {
    const data = readFile(FILE_NAME);
    const newTeacher = req.body;
    newTeacher.id = uuidv4();
    Joi.assert(newTeacher.name, Joi.string().min(1));
    Joi.assert(newTeacher.lastname, Joi.string().min(1));
    Joi.assert(newTeacher.age, Joi.number());
    Joi.assert(newTeacher.gender, Joi.string().min(1).max(1));
    Joi.assert(newTeacher.subject, Joi.array().items(Joi.string()));
    Joi.assert(newTeacher.active, Joi.boolean());
    Joi.assert(newTeacher.institution, Joi.string().min(1));
    Joi.assert(newTeacher.titles, Joi.array().items(Joi.string()));
    data.push(newTeacher);
    writeFile(FILE_NAME, data);
    res.json({ message: "El profesor fue creada con exito" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error al crear el profesor" });
  }
});

//Actualizar la informacion de un profesor
app.put("/teachers/:teacherID", (req, res) => {
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
    Joi.assert(teacher.subject, Joi.array().items(Joi.string()));
    Joi.assert(teacher.active, Joi.boolean());
    Joi.assert(teacher.institution, Joi.string().min(1));
    Joi.assert(teacher.titles, Joi.array().items(Joi.string()));
    teachers[teacherIndex] = teacher;
    writeFile(FILE_NAME, teachers);
    res.json({ teacher: teacher });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error al actualizar la información" });
  }
});

//Eliminar un profesor
app.delete("/teachers/:teacherID", (req, res) => {
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
});

//Puerto de enlace
app.listen(PORT, () => {
  console.log(`${APP_NAME} is running on http://localhost:${PORT}`);
});
