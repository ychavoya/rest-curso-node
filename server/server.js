require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Escuchando puerto ${PORT}`);
});