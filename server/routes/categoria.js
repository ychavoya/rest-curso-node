const express = require('express');
const _ = require('underscore');

let { verificaToken, verificaAdminRole } = require('../middlewares/authentication');

let app = express();

let Categoria = require('../models/categoria');


// Mostrar todas las categorías
app.get('/categoria', verificaToken, (req, res) => {
    
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                categorias,
            });
        });

});


// Mostrar una categoría por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        if(!categoria) {
            return res.status(404).json({
                ok: false,
                err:{
                    message: 'Categoría no encontrada',
                }
            });
        }

        return res.json({
            ok: true,
            categoria,
        });
    });
});

// Crear una categoría
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    categoria.save((err, catDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if(!catDB){
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            categoria: catDB,
        });
    });
});

// Editar
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body,
        {new: true, runValidators: true}, (err, catDB) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }
            if(!catDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Categoría no encontrada',
                    },
                });
            }
            res.json({
                ok: true,
                categoria: catDB,
            });
    });
});

// Borrar
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if(!categoria){
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada',
                },
            });
        }

        res.json({
            ok: true,
            categoria,
        });
    })
});


module.exports = app;