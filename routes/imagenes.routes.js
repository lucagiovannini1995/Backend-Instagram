var Usuario = require('../models/usuario');
var express = require('express');
var app = express();

const fs = require('fs');

//path se utliza para normalizar las rutas
const path = require('path');

//para obtener la imagen guardada en el sevidoir con fileupload en "/upload.routes"
app.get('/:img', (req, res) => {


    var img = req.params.img;

    var pathImg = path.resolve(__dirname, '../uploads/' + img);
    console.log(pathImg);

    if (fs.existsSync(pathImg)) {

        res.sendFile(pathImg)

    } else {
        var pathNoImg = path.resolve(__dirname, '../assets/no_img.jpg');
        console.log(pathNoImg);

        res.sendFile(pathNoImg);
    }


})

module.exports = app;