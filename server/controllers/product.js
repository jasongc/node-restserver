const express = require('express');

const { verificaToken } = require('../config/middlewares/authentication');

const app = express();

let Product = require('../models/productos');


//==================
// Obtener todos los productos
//==================
app.get('/GetAllProducts', verificaToken, (req, res) => {
    let termino = "re";
    let regExp = new RegExp(termino, 'i'); //es igual que el contains() de c#
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Product.find({ isDeleted: false, name: regExp }, 'name isDeleted categoryId _id priceSale description SKU')
        .skip(desde)
        .limit(limite)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Product.countDocuments({ isDeleted: false }, (err, conteo) => {
                res.json({
                    ok: true,
                    products,
                    total: conteo
                })
            })
        })

})

//==================
//Obtener in producto por id
//==================
app.get('/GetProductById/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Product.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productDB || productDB.length === 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        res.json({
            ok: true,
            product: productDB
        })
    })

})

//==================
// Crear producto
//==================
app.post('/CreateProduct', verificaToken, (req, res) => {
    let body = req.body;

    let objProduct = new Product({
        name: body.name,
        priceUnit: body.priceUnit,
        priceSale: body.priceSale,
        description: body.description,
        categoryId: body.categoryId,
        insertUserId: req.user._id,
        SKU: body.SKU
    })

    objProduct.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            product: productDB
        })
    });

})

//==================
// Actualizar producto
//==================
app.put('/UpdateProduct/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let obj = {
        name: body.name,
        categoryId: body.categoryId,
        description: body.description,
        SKU: body.SKU,
        updateUserId: req.user._id,
        updateDate: Date.now().toLocaleString()

    }
    Product.findByIdAndUpdate(id, body, { new: true }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        res.json({
            ok: true,
            product: productDB
        })
    })

})


//==================
//Eliminar producto
//==================
app.delete('/DeleteProduct/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Product.findByIdAndUpdate(id, { isDeleted: true }, (err, productDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        res.json({
            ok: true,
            product: productDeleted
        })
    })

})




module.exports = app;