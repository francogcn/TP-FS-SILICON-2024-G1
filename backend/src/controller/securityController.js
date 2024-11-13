const express = require('express');
const router = express.Router();
var model = require('./../model/usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



// -----------------------------------------------------------
// -- Rutas de escucha (endpoint) disponibles para security --
// -----------------------------------------------------------

router.post('/login', login);

// ----------------------------------------------------------- 
// -- funciones utilizadas por el router  -------------------- 
// -----------------------------------------------------------

async function login(req, res) {
    try {
        const { mail, contrasenia } = req.body;
        const [result] = await model.findByMail(mail);

        if (!result) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }


        const iguales = await bcrypt.compare(contrasenia, result.contrasenia);

        if (iguales) {
            let user = {
                id_usuario: result.id_usuario,
                nombre: result.nombre,
                apellido: result.apellido,
                mail: result.mail,
                rol: result.rol
            }
            console.log('User object:', user);
            //firmar usuario
            jwt.sign(user, 'ultraMegaSecretPass', { expiresIn: '6000s', algorithm: 'HS256' }, (err, token) => {
                if (err) {
                    res.status(500).send({
                        message: err
                    });
                } else {
                    res.status(200).json(
                        {
                            datos: user,
                            token: token
                        }
                    );
                }
            })
        } else {
            res.status(403).send({
                message: 'Contraseña Incorrecta'
            });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


function verificarToken(req, res, next) {
    if (req.headers["authorization"]) {
        try {

            const token = req.headers["authorization"]
            const verified = jwt.verify(token, "ultraMegaSecretPass");
            if (verified) {
                next();
            } else {
                res.status(403).send({
                    message: "Token invalido, permiso denegado"
                });
            }

        } catch (error) {
            res.status(403).send({
                message: "Acceso Denegado"
            });
        }

    } else {
        res.status(403).send({
            message: "No posee token de autorizacion"
        });
    }
}

module.exports = { router, verificarToken };