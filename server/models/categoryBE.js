const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let User = require("../models/usuario");
let Schema = mongoose.Schema;

let categorySchema = new Schema({

    categoryName: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la categoria es necesario'],

    },
    isDeleted: {
        type: Boolean,
        default: 0
    },
    insertDate: {
        type: Date,
        default: new Date(),
    },
    insertUserId: {
        type: String,
        required: [true, 'El ID del usuario es necesario'],
    },
    updateDate: {
        type: String,
        required: false,
    },
    updateUserId: {
        type: String,
        required: false,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' }

});

categorySchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


module.exports = mongoose.model('CategoryBE', categorySchema);;