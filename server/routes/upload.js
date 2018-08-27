const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const { verificaToken } = require('../middlewares/authentication');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', verificaToken, (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files)
    return res.status(400).json({
        ok: false,
        err: {
            message: 'No se ha seleccionado un archivo'
        }
    });

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if(tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(", "),
                tipo,
            }
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let nombreArr = archivo.name.split('.');
    let extension = nombreArr[nombreArr.length - 1];

    // Extensiones permitidas
    const extensions = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensions.join(", "),
                extension,
            }
        });
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getTime()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
        if(err) return res.status(400).json({
            ok: false,
            err,
        });

        //Imagen cargada
        if(tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if(err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Usuario no existe',
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, guardado) => {
            res.json({
                ok: true,
                usuario: guardado,
                img: nombreArchivo,
            });
        });

    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if(err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Producto no existe',
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, guardado) => {
            res.json({
                ok: true,
                usuario: guardado,
                img: nombreArchivo,
            });
        });

    });
}

function borrarArchivo(nombreImagen, tipo){
    let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if(fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
        return true;
    }
    return false;
}

module.exports = app;