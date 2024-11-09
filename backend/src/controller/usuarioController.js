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
// Ruta para registrar un usuario (SignUp)
router.post('/signup', async (req, res) => {
    const { nombre, apellido, mail, contrasenia, id_rol } = req.body;

// Agrega un log para verificar que los datos se están recibiendo correctamente
console.log(req.body); // Aquí podrás ver si todos los campos están presentes

    if (!nombre || !apellido || !mail || !contrasenia || id_rol === undefined) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Agrega un log para verificar que los datos se están recibiendo correctamente
console.log(req.body); // Aquí podrás ver si todos los campos están presentes

    try {
        // Verificar si el usuario ya existe
        const existingUser = await model.findByMail(mail);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Ya existe un usuario con este correo electrónico' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contrasenia, 10);

        // Crear el usuario
        const result = await model.create(nombre, apellido, mail, hashedPassword, id_rol);

        res.status(201).json({
            message: 'Usuario creado con éxito',
            user: { mail: result.mail, id_rol: result.id_rol },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para iniciar sesión (Login)
router.post('/login', async (req, res) => {
    const { mail, contrasenia } = req.body;
    if (!mail || !contrasenia) {
        return res.status(400).json({ message: 'El correo y la contraseña son requeridos' });
    }

    try {
        // Buscar al usuario por mail
        const user = await model.findByMail(mail);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Comparar la contraseña
        const isMatch = await bcrypt.compare(contrasenia, user[0].contrasenia);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Crear un token JWT
        const token = jwt.sign({ id_usuario: user[0].id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

module.exports = router;