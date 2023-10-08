const fs = require("fs");

//Funciones a exportar
module.exports = {
  readFile,
  writeFile,
};

//Leer la base de datos
function readFile(name) {
  try {
    let data = fs.readFileSync(name, "utf8");
    data = JSON.parse(data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

//Escribir en la base de datos
function writeFile(name, data) {
  try {
    fs.writeFileSync(name, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
}
