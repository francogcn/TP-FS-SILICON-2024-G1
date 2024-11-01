const express = require('express');
const router = express.Router();
const model = require('../model/libros.js');


router.get('/', listarLibros);
router.get('/:titulo', buscarPorTitulo);
router.post('/', crearLibro);
router.put('/:titulo', actualizarLibro);
router.delete('/:titulo', eliminarLibro);


async function crearLibro(req, res) {
    try {
        const result = await model.crearLibro(req.body);
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
} 

async function listarLibros(req, res) {
    try {
        const result = await model.listarLibros();
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Solo me trae el primer libro que se creo con ese titulo
async function buscarPorTitulo(req, res) {
    try {
        const result = await model.buscarPorTitulo(req.params.titulo);
        if (!result) {
            return res.status(404).send('Libro no encontrado');
        }
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function actualizarLibro(req, res) {
    try {
        let titulo = req.params.titulo;
        const result = await model.actualizarLibro(req.body, titulo);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error);
    }
}


async function eliminarLibro(req, res) {
    try {
        const { titulo } = req.params;
        const result = await model.eliminarLibro(titulo);
        res.status(204).send(result);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).send(error.message);
    }
}

module.exports = router;