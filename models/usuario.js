var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    nombreUsuario: { type: String, unique: true, required: [true, 'El nombre de usuario es necesario'] },
    email: { type: String, required: [true, 'El email es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesario'] },
    google: { type: Boolean, default: false },
    img: { type: String, required: false }

});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);