//requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


//Inicializar
var app = express();

//body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


//importar Rutas
var usuRout = require('./routes/usuario.routes');
var loginRout = require('./routes/login.routes');
var uploadRout = require('./routes/upload.routes');
var imgRout = require('./routes/imagenes.routes');

//rutas
app.use('/usuario', usuRout);
app.use('/login', loginRout);
app.use('/upload', uploadRout);
app.use('/img', imgRout);


//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/instagramDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'Online');
});

// escuchar peticiones
app.listen(3000, () => {
    console.log('Servidor conectado a puerto 3000: \x1b[32m%s\x1b[0m', 'Online');
});