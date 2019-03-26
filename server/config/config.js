//==============
// Puerto
//==============
process.env.PORT = process.env.PORT || 3333;


//==============
// Entorno
//==============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============
// Vencimiento del token
//==============
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30 * 12;

//==============
// SEED(semilla) de autenticación
//==============
process.env.SEED = process.env.SEED || 'json-secret';

//==============
// DB
//==============
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/saelifDB';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//==============
// GOOGLE CLIENT ID
//==============

process.env.CLIENT_ID = process.env.CLIENT_ID || '875726569600-b3jrmf4drnlfcm1lach5sgne6f4280is.apps.googleusercontent.com';