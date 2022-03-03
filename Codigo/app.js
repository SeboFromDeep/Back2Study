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

<<<<<<< HEAD
 
=======
// modulo para manejar rutas
const path = require("path");

// watch front-end changes
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

// open livereload high port and start to watch public directory for changes
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"), path.join(__dirname, "views"));
>>>>>>> 4484e8032ac6a1125553b8776bcd1833953a0c8f

const express = require("express");
//Libreria que vamos a usar
const app = express();
// monkey patch every served HTML so they know of changes
app.use(connectLivereload());

//express(); Devuelve una Aplicacion (Servidor http que escucha en un puerto determinado)
const config = require("./js/config");//Configuracion bbd y puerto
const PORT = process.env.PORT || config.puerto;

//Configuracion de las vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));

//Ubicacion Archivos estaticos
app.use(express.static(path.join(__dirname, "public")));
//--------------------------------------------------------------------

app.use(express.json());//Devuelve middleware que solo analiza json y solo mira las solicitudes donde el encabezado Content-Type coincide con la opción de tipo.
app.use(express.urlencoded({extended: true}));//Devuelve middleware que solo analiza cuerpos codificados en URL y solo mira las solicitudes donde el encabezado Content-Type coincide con la opción de tipo

const morgan = require("morgan")
app.use(morgan("dev"));//Al realizar cambios en los archivos, se reinicia la aplicacion automaticamente (Para programar)
//Se indica a express donde se encuentan las vistas

//-- Pagina inicial
app.get("/", (request, response) => {
    response.render("login");
});

// ping browser on Express boot, once browser has reconnected and handshaken
liveReloadServer.server.once("connection", () => {
    console.log("Refrescando browser");
    setTimeout(() => {
    liveReloadServer.refresh("/", "/prueba");
    }, 100);
});

//---

/*
app.get("/prueba", (request, response) => {
    response.render("login");
});*/



//----------------------------------------GESTION DE ERRORES-----------
//Para errores de direccionamiento
app.use(function(request, response, next) { 
    response.status(404);
    response.render("error404", { url: request.url });
});

//Errores de servidor
app.use(function(error, request, response, next) {
    response.status(500); 
    response.render("error500", {
        mensaje: error.message, 
        pila: error.stack });
});
//--------------------------------------------------------------------

//-- Escucha del servidor
app.listen(PORT, (err) => {
    if (err) {
        console.error(`No se pudo inicializar el servidor: ${err.message}`);
    } else {
        console.log(`Servidor arrancado en el puerto ${ PORT }`);        
    }
});