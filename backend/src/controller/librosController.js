const express = require("express");
const router = express.Router();
const model = require("../model/libros.js");

router.get("/", listarLibros);
router.get("/titulo/:titulo", buscarPorTitulo);
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
    const result = await model.eliminarLibro(id_libro);
    if (result) {
      res.status(200).json({ message: "Libro eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Libro no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = router;
