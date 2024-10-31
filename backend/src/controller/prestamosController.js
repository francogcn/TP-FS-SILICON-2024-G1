const model = require('../model/prestamos');
const express = require('express');
const router = express.Router();

// ----------------------------------------------------------
// -- Rutas de escucha (endpoint) disponibles para PERSONA --
// ----------------------------------------------------------
router.get('/', listar_prestamos);
router.get('/:id', buscarPorID);

// Funciones CRUD
//Listar todos los prestamos
async function listar_prestamos(req, res) {
    try {
        const results = await model.findAll();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
//Mostrar un prestamo en particular por su ID
async function buscarPorID(req, res) {
    const { id } = req.params;
    try {
        const results = await model.findById(id);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Prestamo no encontrado' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
module.exports = router;