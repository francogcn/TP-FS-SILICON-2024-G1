const express = require("express");
const router = express.Router();
const model = require("../model/libros.js");

router.get("/", listarLibros);
router.get("/titulo/:titulo", buscarPorTitulo);
router.get("/estado/:estado", buscarPorEstado);
router.get("/lastest", lastThree);
router.post("/", crearLibro);
router.put("/:titulo", actualizarLibro);
router.delete("/:id_libro", eliminarLibro);

async function crearLibro(req, res) {
  try {
    const result = await model.crearLibro(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function listarLibros(req, res) {
  try {
    const result = await model.listarLibros();
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function buscarPorTitulo(req, res) {
  try {
    const result = await model.buscarPorTitulo(req.params.titulo);
    if (!result) {
      return res.status(404).send("Libro no encontrado");
    }
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function buscarPorEstado(req, res) {
  try {
    const result = await model.buscarPorEstado(req.params.estado);
    if (!result) {
      return res.status(404).send("Libro no encontrado");
    }
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function lastThree(req, res) {
  try {
    const result = await model.lastThree();
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function actualizarLibro(req, res) {
  try {
    let titulo = req.params.titulo;
    const result = await model.actualizarLibro(req.body, titulo);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function eliminarLibro(req, res) {
  const { id_libro } = req.params;
  try {
    await model.eliminarLibro(id_libro);
    res.status(200).json({ message: "Libro eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = router;
