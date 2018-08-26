require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Config rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Escuchando puerto ${PORT}`);
});