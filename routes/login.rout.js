var Usuario = require('../models/usuario');
var express = require('express');
var rout = express();

var llave = require('../config/config').llave;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');


//===========================
//Login normal
//===========================

rout.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usu) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usu) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontro un usuario con ese email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usu.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'contraseña incorrecta',
                errors: err
            });
        }

        usu.password = ':)';
        const token = jwt.sign({ usuario: usu }, llave, { expiresIn: 1440 });


        return res.status(200).json({
            ok: true,
            usuario: usu,
            token: token,
            id: usu._id
        });
    });
});

module.exports = rout;