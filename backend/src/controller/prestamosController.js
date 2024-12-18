const model = require('../model/prestamos');
const express = require('express');
const router = express.Router();
const { verificarToken } = require('./securityController');

// ----------------------------------------------------------
// -- Rutas de escucha (endpoint) disponibles para PERSONA --
// ----------------------------------------------------------
//router.all('*', verificarToken);
router.get('/', listar_prestamos);
router.get('/:id', buscarPorID);
router.post('/', crearPrestamo);
router.put('/:id_prestamo',actualizarPrestamo);
router.delete('/:id', eliminarPrestamo);
router.get('/usuario/:id_usuario', buscarPorUsuario);
router.get('/libro/:id_libro', buscarPorLibro);
router.get('/usuario/:id_usuario/devueltos', buscarLibrosDevueltosPorUsuario);

// Funciones CRUD

//Listar libros devueltos por el usuario logueado
async function buscarLibrosDevueltosPorUsuario(req, res) {
    const { id_usuario } = req.params;  // El id del usuario
    try {
      const results = await model.findAllDevueltosByUser(id_usuario);
      if (results.length === 0) {
        // Si no se encuentran libros devueltos, enviamos un arreglo vacío
        return res.status(200).json([]);
      }
      res.status(200).json(results);  // Enviar los libros devueltos
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

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
    const { id_usuario, id_libro, fecha_prestamo, fecha_devolucion } = req.body;
    try {
        await model.update(id_prestamo, id_usuario, id_libro, fecha_prestamo, fecha_devolucion);
        res.status(200).json({ message: 'Prestamo actualizado correctamente' });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).send(error.message);
    }
}

async function buscarPorUsuario(req, res) {
    const { id_usuario } = req.params;
    try {
        const results = await model.findAllByUser(id_usuario);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Prestamo no encontrado' });
        }
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function buscarPorLibro(req, res) {
    const { id_libro } = req.params;
    try {
        const results = await model.findAllByBook(id_libro);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Prestamo no encontrado' });
        }
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = router;