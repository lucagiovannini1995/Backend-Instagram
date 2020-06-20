var jwt = require('jsonwebtoken');
var llave = require('../config/config').llave;
var Publicacion = require('../models/publicacion');

//========================
//Verificar Token
//========================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;


    jwt.verify(token, llave, (err, decoded) => {



        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        //guardo el usuario obtenido del jwt para usarlo si es necesario
        req.usuario = decoded.usuario;

        next();
    });
}

exports.verificaUsuario = function(req, res, next) {

    var id = req.params.id;
    var usuario = req.usuario;


    if (usuario._id === id) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'no es administrador',
            errors: { message: 'no es administrador, no tiene acceso' }
        });
    }
}

exports.verificaUsuarioPubli = function(req, res, next) {

    var id = req.params.id;
    var usuario = req.usuario;
    var p = new Publicacion();



    Publicacion.findById(id)
        .then(publi => {
            p = publi;
            console.log(p.usuario);
            console.log(usuario._id);
            if (p.usuario == usuario._id) {
                console.log(true);
                next();
            } else {
                return res.status(401).json({
                    ok: false,
                    mensaje: 'no es administrador',
                    errors: { message: 'no es , no tiene acceso' }
                });
            }
        }).catch(e => console.log(e));

}