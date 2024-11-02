const express = require('express');
const router = express.Router();
const model = require('../model/amigos.js');


router.get('/listar/:id_usuario', listarAmigos);
router.post('/', crearAmistad);
router.delete('/eliminar/:id_amistad', eliminarAmistad);


async function crearAmistad(req, res) {
    try {
        const result = await model.crearAmistad(req.body);
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
} 


async function listarAmigos(req, res) {
    try {
        const result = await model.listarAmigos(req.params.id_usuario);
        if (!result) {
            return res.status(404).send('Amistad no encontrado');
        }
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function eliminarAmistad(req, res) {
    try {
        const { id_amistad } = req.params;
        const result = await model.eliminarAmistad(id_amistad);
        res.status(204).send(result);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).send(error.message);
    }
}

module.exports = router;