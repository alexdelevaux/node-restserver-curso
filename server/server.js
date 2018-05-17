
require('./config/config');

const express = require('express');
const app = express();

const path = require('path');
//eslint-disable-next-line
const color =require('colors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());


//Configuración global de rutas
app.use (require('./routes/index'));

// Habilitar la carpeta public para que se pueda acceder de todos lados

app.use(express.static(path.resolve(__dirname, '../public')));



mongoose.connect(process.env.URL_DB, (err, res) => {

    if (err) throw err;

    //eslint-disable-next-line
    console.log('Base de datos ONLINE'.bgGreen.black);
});

app.listen(process.env.PORT, () => {

    // eslint-disable-next-line
    console.log(`Escuchando en el puerto: ${process.env.PORT}`);
});