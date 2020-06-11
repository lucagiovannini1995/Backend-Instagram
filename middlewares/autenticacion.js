var jwt = require('jsonwebtoken');
var llave = require('../config/config').llave;

//========================
//Verificar Token
//========================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;


    jwt.verify(token, llave, (err, decoded) => {

        console.log(decoded);

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}