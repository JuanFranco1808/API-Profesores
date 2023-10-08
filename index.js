//Librerias externas
const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const Joi = require('joi');

//Modulos internos/funciones importadas
const { readFile, writeFile } = require("./src/files");

//Variables globales
const app = express();
const FILE_NAME = "./db/teachers.txt";

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Funciones de prueba
app.get("/hola", (req, res) => {
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
/* app.post("/teachers", (req, res) => {
  try {
    const data = readFile(FILE_NAME);
    const newTeacher = req.body;
    newTeacher.id = uuidv4();
    data.push(newTeacher);
    writeFile(FILE_NAME, data);
    res.json({ message: "El profesor fue creada con exito" });
  } catch (error) {
    console.error(error);
    res.json({ message: "Error al crear el profesor" });
  }
}); */

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
    console.error(error);
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
  teachers[teacherIndex] = teacher;
  writeFile(FILE_NAME, teachers);
  res.json({ teacher: teacher });
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
app.listen(4004, () => {
  console.log("server is running on http://localhost:4004");
});
