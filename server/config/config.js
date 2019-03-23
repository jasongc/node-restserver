//==============
// Puerto
//==============
process.env.PORT = process.env.PORT || 3333;


//==============
// Entorno
//==============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//==============
// DB
//==============
let urlDB;

// if (process.env.NODE_ENV === 'dev') {
//     urlDB = 'mongodb://localhost:27017/saelifDB';
// } else {
//     urlDB = 'mongodb+srv://jasongc:Udemy123+@cluster0-pdxxo.mongodb.net/test'
// }
urlDB = process.env.NODE_URI;
process.env.URLDB = urlDB;