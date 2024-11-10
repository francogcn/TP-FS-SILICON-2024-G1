//archivo encargado de manejar las operaciones de la tabla "rol"

//se importan los módulos requeridos
const express = require('express');
const router = express.Router();
const model = require('../model/rol'); 

// ----------------------------------------------------------
// -- Rutas de escucha (endpoint) disponibles para ROL --
// ----------------------------------------------------------

router.get('/', listar_roles);


// -------------------------------------------------------------- 
// -- Operaciones CRUD utilizadas por el router  ----------------
// --------------------------------------------------------------

async function listar_roles(req, res) {
    try {
        const results = await model.getAll();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = router;