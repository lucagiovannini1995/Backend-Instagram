var express = require('express');
var rout = express();
var autenticacion = require('../middlewares/autenticacion');
var Publicacion = require('../models/publicacion');




//===========================
//actualizar Usuario
//===========================

rout.put('/:id', [autenticacion.verificaToken, autenticacion.verificaUsuario], (req, res) => {
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

rout.delete('/:id', [autenticacion.verificaToken, autenticacion.verificaUsuarioPubli], (req, res) => {

    var id = req.params.id;

    Publicacion.findByIdAndRemove(id, (err, publiRemoved) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar publicacion',
                errors: err
            });
        }
        return res.status(200).json({
            ok: true,
            mensaje: 'Se elimino publicacion con exito'
        });
    });
})


//===========================
//Obtener Publicacion
//===========================

rout.get('/:id', autenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    Publicacion.findById(id, (err, publi) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al obtener publicacion',
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            publicacion: publi
        });
    })
});

//===========================
//Obtener publicaciones
//===========================

rout.get('/', (req, res) => {

    Publicacion.find({})
        .exec((err, publi) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al obtner los publicaciones',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                publicacion: publi
            });
        })
});

//===========================
//Crear Publicacion
//===========================
rout.post('/', [autenticacion.verificaToken], (req, res) => {

    var body = req.body;

    var publicacion = new Publicacion({

        descripcion: body.descripcion,
        usuario: req.usuario._id,
        img: body.img,
        fecha: body.fecha

    });

    publicacion.save((err, publi) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear el publicacion',
                errors: err
            });
        }
        return res.status(201).json({
            ok: true,
            mensaje: 'Publicacion hecha correctamente',
            usuario: publi
        })
    });

});

module.exports = rout;