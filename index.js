//Librerias externas
require("dotenv").config();
const express = require("express");
const moment = require("moment-timezone");

//Modulos internos/funciones importadas
const { readFile, writeFile } = require("./src/files");
const teachersAPI = require("./src/routes/teachersAPI.js");
const teachers = require("./src/routes/teachers.js");
const authRouter = require("./src/routes/users.routes.js");

//Variables globales
const app = express();
const FILE_NAME_DB2 = "./db/access.txt";
const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "Ingenieria informatica web 2",
    resave: true,
    saveUninitialized: true,
  })
);
require("./src/config/passport")(app);

//Motor de plantillas EJS
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

//Funciones de prueba
app.get("/", (req, res) => {
  res.send("Hola mundo");
  //acces.txt
  const DB2 = readFile(FILE_NAME_DB2);
  const newDate =
    moment().tz("America/Bogota").format() +
    ` ${req.method}` +
    " Prueba" +
    ` ${req.path}`;
  console.log(newDate);
  DB2.push(newDate);
  writeFile(FILE_NAME_DB2, DB2);
  //access.txt
});

//Rutas vistas
app.use("/teachers", teachers);

//Rutas API
app.use("/API/teachers", teachersAPI);

//Rutas auth
app.use("/auth", authRouter);

//Puerto de enlace
app.listen(PORT, () => {
  console.log(`${APP_NAME} is running on http://localhost:${PORT}`);
});
