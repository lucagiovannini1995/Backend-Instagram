var express = require('express');
var rout = express();
const fileUpload = require('express-fileupload');
var Usuario = require('../models/usuario');


var fs = require('fs');

rout.use(fileUpload());

rout.post('/:nombreUsuario', (req, res) => {


    var nom_usu = req.params.nombreUsuario;


    Usuario.findOne({ nombreUsuario: nom_usu }, (err, usu) => {
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

        var id = usu.id;


        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no se encontro ningun archivo',
                errors: 'debe seleccionar una imagen'
            })
        }

        // The name of the input field (i.e. "nombreFile") is used to retrieve the uploaded file
        let nombreFile = req.files.imagen;
        let nombreCortado = nombreFile.name.split('.');
        var extensionArch = nombreCortado[nombreCortado.length - 1];

        //Extenciones validas
        var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

        if (extensionesValidas.indexOf(extensionArch) < 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Extension no valida',
                errors: 'la extensiones validas son ' + extensionesValidas.join(', ')
            })
        }

        //Personalizando nombre
        var nombreImg = id + '-' + new Date().getMilliseconds() + '.' + extensionArch;


        //path
        var path = './uploads/' + nombreImg

        // Use the mv() method to place the file somewhere on your server
        nombreFile.mv(path, (err) => {
            if (err)
                return res.status(500).json({
                    ok: true,
                    mensaje: 'Error al mover el archivo',
                    errors: err
                })

            var pathViejo = './uploads/' + usu.img;

            console.log(pathViejo);
            //si existe elimina la imagen vieja
            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (err, img) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al borrar imagen',
                            errors: err
                        });
                    } else {
                        console.log('eliminado');
                    }
                });
            }

            usu.img = nombreImg;

            usu.save((err, usuActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de usuario actualizada',
                    usuario: usuActualizado
                });
            });
        });


    });
});


module.exports = rout;