const model = require('../model/prestamos');
const express = require('express');
const router = express.Router();

// ----------------------------------------------------------
// -- Rutas de escucha (endpoint) disponibles para PERSONA --
// ----------------------------------------------------------
router.get('/', listar_prestamos);

// Funciones CRUD
async function listar_prestamos(req, res) {
    try {
        const results = await model.findAll();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = router;