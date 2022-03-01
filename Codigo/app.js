'use strict'
//PASOS
/*
Inicializar Terminal (Pestaña de arriba), colocarse 
en la carpeta pruebaServer y ejecutar comandos.
1) npm init -y
Inicializa package.json
2)Modificar packcage.json -->private: true
Para evitar mensajes de error, que no son necesarios

3) npm install express --save
4) npm install [nombreModulo] --save
Para instalar cualquier modulo (los require) que se vaya a necesitar, la opt "--save" sirve para añadir la dependencia a package.json
5) Para ejecurtar --> node app.js
node [nombre.js] estando dentro de la carpeta donde se aloja [nombre.js], lo ejecuta

¿Que es node? Permite ejecutar codigo javascript en servidor
¿Que es express? Framework, modulo que forma parte de node, separacion MVC, basado en el modulo http, para gestionar las peticiones web (GET y POST)
*/
const express = require("express");
//Libreria que vamos a usar
const app = express();
//express(); Devuelve una Aplicacion (Servidor http que escucha en un puerto determinado)
const config =require("./js/config");//Configuracion bbd y puerto

//Configuracion de las vistas
//Modulo para manejar direcciones
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//Se indica a express donde se encuentan las vistas

//------------------------------------Pagina inicial-----------------
app.get("/", (request, response) => {
    response.render("index");
      
    
});
//--------------------------------------------------------------------

app.get("/prueba", (request, response) => {
    response.render("prueba");
      
    
});

//--------------------------------------Escucha del servidor----------
app.listen(config.puerto, (err) => {
    if (err) {
        console.error(`No se pudo inicializar el servidor: ${err.message}`);
    } else {
        console.log("Servidor arrancado en el puerto "+config.puerto);        
    }
});