//archivo encargado de manejar las operaciones de la tabla "resenia"

//se importan los módulos requeridos
const express = require('express');
const router = express.Router();
const model = require('../model/resenia'); 

// ----------------------------------------------------------
// -- Rutas de escucha (endpoint) disponibles para RESENIA --
// ----------------------------------------------------------

router.get('/', listar_resenias);
router.get('/:id_resenia', buscarPorIdResenia);
//la ruta "/libro/:libro" puede parecer innecesariamente larga, pero se pone así para evitar errores por falta de especifidad
router.get('/libro/:id_libro', buscarPorIdLibro);
router.post('/', crear_resenia);
router.put('/:id_resenia', actualizar_resenia);
router.delete('/:id_resenia', eliminar_resenia);

// -------------------------------------------------------------- 
// -- Operaciones CRUD utilizadas por el router  ----------------
// --------------------------------------------------------------

async function listar_resenias(req, res) {
    try {
        const results = await model.findAll();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function buscarPorIdResenia(req, res) {
    const { id_resenia } = req.params;
    try {
        const results = await model.findByIdResenia(id_resenia);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Resenia no encontrada' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function buscarPorIdLibro(req, res) {
    const { id_libro } = req.params;
    try {
        const results = await model.findByIdLibro(id_libro);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Resenia no encontrada' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function crear_resenia(req, res) {
    const { id_usuario, id_libro, texto_resenia, clasificacion, id_rol } = req.body; 
    try {
        const resultado = await model.create(id_usuario, id_libro, texto_resenia, clasificacion, id_rol);
        res.status(201).json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function actualizar_resenia(req, res) {
    //ojo con como se pasan esos parametros
    const { id_resenia } = req.params;
    const { id_usuario, id_libro, texto_resenia, clasificacion, id_rol } = req.body; 
    try {
        await model.update(id_resenia, id_usuario, id_libro, texto_resenia, clasificacion, id_rol);
        res.status(200).json({ message: 'Resenia actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function eliminar_resenia(req, res) {
    const { id_resenia } = req.params;
    try {
        await model.delete(id_resenia);
        res.status(200).json({ message: 'Resenia eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = router;