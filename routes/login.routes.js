var Usuario = require('../models/usuario');
var express = require('express');
var rout = express();

var llave = require('../config/config').llave;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');


var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
//===========================
// Login Google
//===========================


rout.post('/google', async(req, res) => {
    var token = req.body.token;

    //Verifucar el token google
    client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    }, (err, login) => {
        if (err) {
            return res.status(403).json({
                ok: false,
                mensaje: 'token no valido',
                errors: err
            });
        }

        var googleUser = login.getPayload();

        Usuario.findOne({ email: googleUser.email }, (err, usuDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }

            if (usuDB) {
                //verifica que no exista un usario con el mismo email pero registardo normalmente
                if (usuDB.google === false) {

                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Debe logearse por autenticacion normal',
                        errors: err
                    });

                } else {

                    const token = jwt.sign({ usuario: usuDB }, llave, { expiresIn: 1440 });

                    return res.status(200).json({
                        ok: true,
                        usuario: usuDB,
                        token: token,
                        id: usuDB._id
                    });

                }
            } else {

                //El usuario no existe ..hay que crearlo
                var usuario = new Usuario();

                usuario.nombre = googleUser.name;
                usuario.email = googleUser.email;
                usuario.img = googleUser.picture;
                usuario.google = true;
                usuario.nombreUsuario = googleUser.given_name + googleUser.at_hash;
                usuario.password = ':)';

                usuario.save((err, usuNew) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al crear  usuario',
                            errors: err
                        });
                    }
                    //se genera el token para enviar ya que el otro es solo para validar el login google
                    const token = jwt.sign({ usuario: usuNew }, llave, { expiresIn: 1440 });
                    usuNew.password = ':)';

                    res.status(200).json({
                        ok: true,
                        usuario: usuNew,
                        token: token,
                        id: usuNew._id
                    });
                })

            }
        });
        
    });







})


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

        //comparo la contraseña ecryptada con la recibida
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