const express = require('express');
const routes = require('./routes');
const path = require('path');
//const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config({ path: 'variables.env'});


//helpers con funciones
const helpers = require('./helpers');

//Crear la conexion a la BD
const db = require('./config/db');

//Importamos modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

 
db.sync()
    .then(()=> console.log('Conectado al server'))
    .catch(error => console.log(error));

//crear una app de express
const app = express();

//Donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar Pub
app.set('view engine', 'pug');

//Habilitar bodyParser para leer datos
app.use(express.urlencoded({extended: true}));

app.use(expressValidator());

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Agregar flash messages
app.use(flash());

app.use(cookieParser());

//Habilitamos el uso de sesiones
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar var dump a la aplicacion
app.use((req, res, next) =>{
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});


app.use('/', routes());

//app.listen(3000);

//Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, ()=> {
    console.log('El servidor esta funcionando');
})


