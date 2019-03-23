const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');

const User = require('../models/usuario');

const app = express();


app.get('/usuario', (req, res) => {
    //paginacion!!!!!

    let desde = Number(req.query.desde) || 0;

    let limite = Number(req.query.limite) || 5;
    User.find({ isDeleted: false }, 'name role isDeleted google id') //campos que se verán
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            User.countDocuments({ isDeleted: false }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    total: conteo
                })
            })
        })
});

app.post('/usuario', (req, res) => {
    let salt = bcrypt.genSaltSync(10);

    let body = req.body;
    let hash = bcrypt.hashSync(body.password, salt);

    let user = new User({
        name: body.name,
        email: body.email,
        password: hash,
        //img: body.img,
        role: body.role
    })

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        });
    });

});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'isDeleted']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: userDB
        })
    })
});

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let objUser = {
        isDeleted: true,
    }
    User.findByIdAndUpdate(id, objUser, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        };

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    })
})

module.exports = app;