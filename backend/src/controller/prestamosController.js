const model = require('../model/prestamos');
const express = require('express');
const router = express.Router();

// ----------------------------------------------------------
// -- Rutas de escucha (endpoint) disponibles para PERSONA --
// ----------------------------------------------------------
router.get('/', listar_prestamos);
router.get('/:id', buscarPorID);
router.post('/', crearPrestamo);
router.put('/:id_prestamo',actualizarPrestamo);
router.delete('/:id', eliminarPrestamo);

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

async function crearPrestamo(req, res) {
    const { id_usuario, id_libro, fecha_prestamo, fecha_devolucion } = req.body;
    try {
        const result = await model.create(id_usuario, id_libro, fecha_prestamo, fecha_devolucion);
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function eliminarPrestamo(req, res) {
    const { id } = req.params;
    try {
        const result = await model.deleteById(id);
        if (result) {
            res.status(200).json({ message: 'Préstamo eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Préstamo no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function actualizarPrestamo(req, res) {
    const { id_prestamo } = req.params;
    const { id_libro, fecha_prestamo, fecha_devolucion } = req.body;
    try {
        await model.update(id_prestamo, id_libro, fecha_prestamo, fecha_devolucion);
        res.status(200).json({ message: 'Prestamo actualizado correctamente' });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).send(error.message);
    }
}
module.exports = router;