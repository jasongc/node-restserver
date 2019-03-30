const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/usuario');
const Product = require('../models/productos');
const fs = require('fs');
const path = require('path');


app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        })
    } //.file viene del app.use(fileUpload())

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos permitidos son: ' + tiposValidos.join(", ") + "."
            }
        })
    }

    let archivo = req.files.archivo; //.archivo viene a ser el campo que envío en el body
    let splitName = archivo.name.split(".");
    let extension = splitName[splitName.length - 1];

    //Extensiones permitidas
    let extenValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extenValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extenValidas.join(", ") + "."
            }
        })
    }

    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    })
})
const imagenUsuario = (id, res, nombreArchivo) => {
    User.findById(id, (err, userDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!userDB || userDB.length === 0) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el usuario en la base de datos'
                }
            })
        }

        borraArchivo(userDB.img, 'usuarios');

        userDB.img = nombreArchivo;

        userDB.save((err, userSave) => {
            res.json({
                ok: true,
                usuario: userSave,
                img: nombreArchivo
            })
        })
    })
}

const imagenProducto = (id, res, nombreArchivo) => {
    Product.findById(id, (err, productDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos')

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB || productDB.length === 0) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No existe el producto en la base de datos'
                }
            })
        }
        borraArchivo(productDB.img, 'productos')

        productDB.img = nombreArchivo;

        productDB.save((err, productSave) => {
            res.json({
                ok: true,
                producto: productSave,
                img: nombreArchivo
            })
        })
    })
}

const borraArchivo = (nommbreImagen, tipo) => {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nommbreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;