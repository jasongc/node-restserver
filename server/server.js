require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express()

const bodyParser = require('body-parser');

//los app.use son los famosos middleware
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


//total de controladores
app.use(require('./controllers/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datos ONLINE');
});
mongoose.set('useCreateIndex', true);

app.listen(process.env.PORT, () => {

    console.log(`Escuchando puerto ${process.env.PORT}`);
})