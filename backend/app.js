const express = require('express');
const config = require('./src/config/config.json');
const app = express();


var cors = require('cors');
app.use(cors());

var morgan = require('morgan')
app.use(morgan('tiny'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//*Ejemplos que subió el profe de como agregar controladores y rutas*//

//conocer los distintos controladores, saber donde estan, traelos como constantes locales
// const usuarioController = require('./src/controller/usuarioController');
const prestamosController = require('./src/controller/prestamosController')
const librosController = require('./src/controller/librosController');
const amigosController = require('./src/controller/amigosController');

//redireccionar las distintas peticiones a su correspondiente controlador.
//app.use('/usuarios', usuarioController);
app.use('/api/prestamos', prestamosController)
app.use("/api/libros", librosController);
app.use("/api/amistad/", amigosController);


// Defino una funcion que intenta iniciar el servidor en el puerto especificado o en el siguiente disponible
function startServer(puerto) {
    const server = app.listen(puerto, () => {
        console.log(`Servidor escuchando en: http://localhost:${puerto}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Puerto ${puerto} en uso, intentando con el puerto ${puerto + 1}...`);
            puerto++;
            startServer(puerto); // Intenta con el siguiente puerto
        } else {
            console.error("Error al iniciar el servidor:", err);
        }
    });
}

// invocamos la funcion que intenta iniciar el servidor en el puerto que le pasemos
startServer(config.server.port);

module.exports = app;