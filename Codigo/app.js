'use strict'

const path = require("path");// modulo para manejar rutas
// watch front-end changes
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
// open livereload high port and start to watch public directory for changes
const liveReloadServer = livereload.createServer();
const express = require("express");
//Libreria que vamos a usar
const app = express();
const config = require("./js/config");//Configuracion bbd y puerto
const PORT = process.env.PORT || config.puerto;
const morgan = require("morgan");
//Para validar errores en formularios.
const { check, validationResult } = require("express-validator"); // https://www.youtube.com/watch?v=hBETsBY3Hlg

//Configuracion de las vistas y usos
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));
app.use(connectLivereload());


//Ubicacion Archivos estaticos
app.use(express.static(path.join(__dirname, "public")));
liveReloadServer.watch(path.join(__dirname, "public"), path.join(__dirname, "views"));
//--------------------------------------------------------------------

app.use(express.json());//Devuelve middleware que solo analiza json y solo mira las solicitudes donde el encabezado Content-Type coincide con la opción de tipo.
app.use(express.urlencoded({extended: true}));//Devuelve middleware que solo analiza cuerpos codificados en URL y solo mira las solicitudes donde el encabezado Content-Type coincide con la opción de tipo
app.use(morgan("dev"));//Al realizar cambios en los archivos, se reinicia la aplicacion automaticamente (Para programar)
//Se indica a express donde se encuentan las vistas



//---------------------------------Sesion---------------------------------
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.databaseConfig);
const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});



app.use(middlewareSession);

//Para ver que usuario esta logeado en el momento (Para pruebas) A eliminar en un futuro no muy lejano
app.use(function(request, response, next) {
    console.log("Usuario logeado: ", request.session.userName);
    next();
})
//--------------------------------------------------------------------




//Routers
const routerUser = require("./routers/userRouter");
app.use("/usuarios", routerUser);

const routerTask = require("./routers/taskRouter");
const { render } = require("express/lib/response");
app.use("/tareas", routerTask);


//-- Pagina inicial
app.get("/", (request, response) => {
    response.status(200);
    
    response.render("login", {  title: "Página de inicio de sesión",
                                msgRegistro: false});
});


//-----------------------------------Registro --> Login--------------
app.get("/login", (request, response) => {
    response.status(200);
    
    response.render("login", {  title: "Pagina de logeo", 
                                    msgRegistro: false});
    
});

//-- Pagina de registro Login --> Registro
app.get("/signup", (request, response) => {     
    response.status(200);
    const errors = validationResult(request);
    response.render("signup", { title: "Página de registro",
                                errores: errors.mapped() ,
                                msgRegistro: false});//False para usu que no existe True si ya existe 
});

app.get("/forgot-password", (req, res, next) => {
    res.render("forgot-password");
});

app.get("/reset-password/:id/:token", (request, response) => {
    
    cP.modPass
});

/*app.post("/forgot-password", (req, res, next) => {
    const { email } = req.body;

    res.send(email);
});
*/
// ping browser on Express boot, once browser has reconnected and handshaken
liveReloadServer.server.once("connection", () => {
    console.log("Refrescando browser");
    setTimeout(() => {
    liveReloadServer.refresh("/");
    }, 100);
});


//-- -GESTION DE ERRORES 

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

//---

//-- Escucha del servidor
app.listen(PORT, (err) => {
    if (err) {
        console.error(`No se pudo inicializar el servidor: ${err.message}`);
    } else {
        console.log(`Servidor arrancado en el puerto ${ PORT }`);        
    }
});

module.exports = app;

