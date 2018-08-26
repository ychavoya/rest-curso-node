const express = require('express');
const _ = require('underscore');

const { verificaToken, verificaAdminRole } = require('../middlewares/authentication');

let app = express();

let Producto = require('../models/producto');

// Productos todos, populate usuario cat, paginado
app.get('/producto', verificaToken, (req, res) => {
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let query = {
        disponible: true,
    }

    Producto.find(query)
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                productos,
            });
        });

});

// Producto por id, populate
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre, email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if(!producto) {
                return res.status(404).json({
                    ok: false,
                    err:{
                        message: 'Producto no encontrado',
                    }
                });
            }

            return res.json({
                ok: true,
                producto,
            });
        });
});


// Producto por id, populate
app.get('/producto/buscar/:q', verificaToken, (req, res) => {

    let query =  decodeURI(req.params.q);

    let regex = new RegExp(query, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre, email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if(!productos) {
                return res.status(404).json({
                    ok: false,
                    err:{
                        message: 'No hay resultados',
                    }
                });
            }

            return res.json({
                ok: true,
                productos,
                query,
            });
        });
});

// Crear producto, guardar user, guardar cat
app.post('/producto', verificaToken, (req, res) => {
    let { nombre, precioUni, descripcion, disponible, categoria } = req.body;

    let producto = new Producto({
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria,
        usuario: req.usuario._id,
    });

    producto.save((err, prodDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if(!prodDB){
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.status(201).json({
            ok: true,
            producto: prodDB,
        });
    });
});

// Actualizar producto
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, [
        'nombre', 'precioUni', 'descripcion', 'categoria', 'disponible'
    ]);

    Producto.findByIdAndUpdate(id, body,
        {new: true, runValidators: true}, (err, prodDB) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if(!prodDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado',
                    },
                });
            }
            res.json({
                ok: true,
                categoria: prodDB,
            });
    });
});

// Borrar producto, disponible false
app.delete('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible: false}, {new: true}, (err, producto) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if(!producto){
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado',
                },
            });
        }

        res.json({
            ok: true,
            producto,
        });
    })
});


module.exports = app;