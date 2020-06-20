var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicacionSchema = new Schema({

    descripcion: { type: String },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El usuario es necesario'] },
    fecha: { type: Date, required: [true, 'la fecha es necesaria'] },
    img: { type: String, required: [true, 'La imagen es necesaria'] }

});



module.exports = mongoose.model('Publicacion', PublicacionSchema);