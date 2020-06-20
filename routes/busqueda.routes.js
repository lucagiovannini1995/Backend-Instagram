var express = require('express');
var rout = express();

var Usuario = require('../models/usuario');

rout.get('/:nombreUsuario', (req, res) => {

    var nomUsu = req.params.nombreUsuario;

    var regExp = new RegExp(nomUsu, 'i');

    Usuario.find({ nombreUsuario: regExp }, (err, usu) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar los usuario',
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            usuaios: usu
        });
    })

});

module.exports = rout;