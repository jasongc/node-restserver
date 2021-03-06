const jwt = require('jsonwebtoken');


//=================
// Verificar token
//=================

let verificaToken = (req, res, next) => {
    let token = req.get('token'); //la data que viene en el header

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }
        req.user = decoded.user;
        next();
    })

}

//=================
// Verifica AdminRole
//=================

let verificaAdmin_Role = (req, res, next) => {
    let token = req.get('token'); //la data que viene en el header
    let user = req.user;
    console.log(user);
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

}


//Verifica token por url para imagen
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }
        req.user = decoded.user;
        next();
    })
}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}