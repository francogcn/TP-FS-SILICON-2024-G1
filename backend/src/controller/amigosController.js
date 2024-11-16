const express = require('express');
const router = express.Router();
const model = require('../model/amigos.js');


router.get('/listar/:id_usuario', listarAmigos);
router.get('/', listarAmistades);
router.post('/', crearAmistad);
router.delete('/eliminar/:id_amistad', eliminarAmistad);
router.get('/resenias_amigos/:id_usuario', buscarReseniasPorId);


async function listarAmistades(req, res) {
    try {
        const results = await model.findAll();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

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
      res.status(200).json(result);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

async function buscarReseniasPorId(req, res) {
    try {
        const result = await model.buscarReseniasPorId(req.params.id_usuario);
        if (!result) {
            return res.status(404).send('No hay resenias de amigos');
        }
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = router;