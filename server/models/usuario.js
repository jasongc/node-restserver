const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};


let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },

    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },

    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Cuando se intente mostrar un json se dispara
userSchema.methods.toJSON = function() {
    let userData = this;
    let userObject = userData.toObject();

    delete userObject.password;

    return userObject;
}


userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('User', userSchema);