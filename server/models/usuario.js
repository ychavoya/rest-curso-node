const mongoose = require('mongoose');
const uniqueVal = require('mongoose-unique-validator');

const ROLES = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido',
};

let usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'La password es necesaria'],
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: ROLES,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false
    },
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    
    return userObject;
}

usuarioSchema.plugin(uniqueVal, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);