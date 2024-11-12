//archivo encargado de manejar las operaciones de la tabla "usuario"

//se importan los módulos requeridos
const express = require('express');
const router = express.Router();
const model = require('../model/usuario'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ----------------------------------------------------------
// -- Rutas de escucha (endpoint) disponibles para USUARIO --
// ----------------------------------------------------------

router.get('/', listar_usuarios);
router.get('/:id_usuario', buscarPorID);
router.get('/perfil/:id_usuario', buscarDatosPerfil);
//la ruta "/mail/:mail" puede parecer innecesariamente larga, pero se pone así para evitar errores por falta de especifidad
router.get('/mail/:mail', buscarPorMail);
router.post('/', crear_usuario);
router.put('/:id_usuario', actualizar_usuario);
router.delete('/:id_usuario', eliminar_usuario);
router.get('/usuarios/:id_usuario', findUsers);


// -------------------------------------------------------------- 
// -- Operaciones CRUD utilizadas por el router  ----------------
// --------------------------------------------------------------

async function listar_usuarios(req, res) {
    try {
        const results = await model.findAll();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function buscarPorID(req, res) {
    const { id_usuario } = req.params;
    try {
        const results = await model.findById(id_usuario);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function buscarDatosPerfil(req, res) {
    const { id_usuario } = req.params;
    try {
        const results = await model.findProfile(id_usuario);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function buscarPorMail(req, res) {
    const { mail } = req.params;
    try {
        const results = await model.findByMail(mail);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function crear_usuario(req, res) {
    const { nombre, apellido, mail, contrasenia, id_rol } = req.body; 
    try {
        const resultado = await model.create(nombre, apellido, mail, contrasenia, id_rol);
        res.status(201).json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function actualizar_usuario(req, res) {
    const { id_usuario } = req.params;
    const { nombre, apellido, mail, contrasenia, id_rol } = req.body; 
    try {
        await model.update(id_usuario, nombre, apellido, mail, contrasenia, id_rol);
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function eliminar_usuario(req, res) {
    const { id_usuario } = req.params;
    try {
        await model.delete(id_usuario);
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function findUsers(req, res) {
    const { id_usuario } = req.params;
    try {
        const results = await model.findUsers(id_usuario);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuarios no encontrados' });
        }
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = router;