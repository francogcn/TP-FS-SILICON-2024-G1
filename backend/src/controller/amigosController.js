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
        const result = await model.listarAmigos();
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function eliminarAmistad(req, res) {
    try {
        const { titulo } = req.params;
        const result = await model.eliminarAmistad(titulo);
        res.status(204).send(result);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).send(error.message);
    }
}

module.exports = router;