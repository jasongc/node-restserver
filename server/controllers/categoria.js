const express = require('express');

let { verificaToken, verificaAdmin_Role } = require("../config/middlewares/authentication");

let app = express();

let CategoryBE = require("../models/categoryBE");
let User = require("../models/categoryBE");

//============================
//Muestra todas las categorias
//============================

app.get('/categorias', verificaToken, (req, res) => {
    CategoryBE.find({ isDeleted: false })
        .populate('user')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                    ok: true,
                    categories,

                })
                // CategoryBE.countDocuments({ isDeleted: false }, (err, conteo) => {

            // })
        })
})

//============================
//Muestra categoria por id
//============================

app.get('/categoria', verificaToken, (req, res) => {
    let id = req.query.id;

    CategoryBE.find({ _id: id, isDeleted: false }, (err, categoriesBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (categoriesBD.length == 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriesBD
        })
    })
})

//============================
//Crear nnueva categoría
//============================

app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;

    let _categoryBE = new CategoryBE({
        categoryName: body.categoryName,
        insertUserId: req.user._id,
        insertDate: new Date().toLocaleDateString(),
    })

    _categoryBE.save((err, categoryDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    })
})

//============================
//Actualiza la categoría
//============================

app.put('/UpdateCategoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    let body = {
        categoryName: req.body.categoryName,
        updateDate: new Date().toLocaleDateString(),
        updateUserId: req.user._id,
    }

    CategoryBE.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoryDB
        })
    })
})


//============================
//Elimina categoria
//============================

app.delete('/DeleteCategory/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = {
        isDeleted: true,
        updateDate: new Date().toLocaleDateString(),
        updateUserId: req.user._id
    }
    CategoryBE.findByIdAndUpdate(id, body, { new: true }, (err, CategoryDeleteDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            })
        }
        if (!CategoryDeleteDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            })
        };
        res.json({
            ok: true,
            categoria_eliminada: CategoryDeleteDB
        })

    })
})


module.exports = app;