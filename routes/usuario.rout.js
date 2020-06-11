var express = require('express');
var Usuario = require('../models/usuario');
var rout = express();
var bcrypt = require('bcrypt');

var autenticacion = require('../middlewares/autenticacion');

//===========================
//actualizar Usuario
//===========================

rout.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usu) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usu) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario con el id ' + id + ' no existe',
                errors: 'no existe un usuario con ese id'
            });
        }
        usu.nombre = body.nombre;
        usu.nombreUsuario = body.nombreUsuario;
        usu.email = body.email;

        usu.save((err, usuActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            return res.status(200).json({
                ok: true,
                mensaje: 'Usuario actualizado',
                usuario: usuActualizado
            });
        });


    });

});


//===========================
//Borrar Usuario
//===========================

rout.delete('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuRemoved) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        return res.status(200).json({
            ok: true,
            mensaje: 'Se elimino el usuario: ' + usuRemoved.nombreUsuario + 'con exito.'
        });
    });
})


//===========================
//Obtener Usuario
//===========================

rout.get('/:id', autenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    Usuario.findById(id, 'nombre nombreUsuario email password', (err, usu) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al obtener los usuario',
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            usuaios: usu
        });
    })
});

//===========================
//Obtener Usuarios
//===========================

rout.get('/', (req, res) => {

    Usuario.find({}, 'nombre nombreUsuario email password', )
        .exec((err, usu) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al obtner los usuarios',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                usuaios: usu
            });
        })
});

//===========================
//Crear Usuario
//===========================


rout.post('/', autenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({

        nombre: body.nombre,
        nombreUsuario: body.nombreUsuario,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        google: body.google,
        img: body.img

    });


    usuario.save((err, usuGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear el usuario',
                errors: err
            });
        }
        return res.status(201).json({
            ok: true,
            mensaje: 'Usuario ' + usuGuardado.nombreUsuario + ' creado correctamente.',
            usuario: usuGuardado
        })
    })

});

module.exports = rout;