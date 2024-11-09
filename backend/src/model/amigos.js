const db = require('../config/config_database');

const amigos = {
    crearAmistad: async function (datos) {
        try {
            const params = [datos.id_usuario, datos.id_amigo_usuario];
            const query = "INSERT INTO Amigos (id_usuario, id_amigo_usuario) VALUES (?,?)";
            const result = await db.execute(query, params);
            return { message: `Amistad creada con exito`, detail: result };
        } catch (error) {
            throw new Error('No se pudo crear la amistad debido a: ' + error.message);
        }
    },


    listarAmigos: async function(id_usuario) {
        try {
            // query = `select u.nombre, u.apellido from Amigos a join Usuario u on a.id_amigo_usuario = u.id_usuario where a.id_usuario = ?`
            const query = `SELECT u.nombre, u.apellido FROM Amigos a 
            JOIN Usuario u ON (a.id_amigo_usuario = u.id_usuario OR a.id_usuario = u.id_usuario)
            WHERE ? IN (a.id_usuario, a.id_amigo_usuario)
            AND u.id_usuario != ?;`
            const [result] = await db.execute(query, [id_usuario, id_usuario]);
            return result;
        } catch (error) {
            throw new Error('Error al listar amistad ' + error.message);
        }
        
    },


    eliminarAmistad: async function(id_amistad) {
        try {
            const query = "DELETE FROM Amigos WHERE id_amistad =?;";
            const result = await db.execute(query, [id_amistad]);

            if (result.affectedRows === 0) {
                const error = new Error("No se encontró amistad");
                error.statusCode = 404;
                throw error;
            }
            return { message: 'Amistad eliminada con éxito ', detail: result };

        } catch (error) {
            throw new Error('Error al eliminar la amistad: ' + error.message);
        }
    },

    buscarReseniasAmigos: async function(id_amigo) {
        try {
            const query = 'SELECT r.id_resenia, u.nombre AS nombre_amigo, u.apellido AS apellido_amigo, l.titulo AS titulo_libro, r.texto_resenia, r.clasificacion FROM Resenia r JOIN Usuario u ON r.id_usuario = u.id_usuario JOIN Libro l ON r.id_libro = l.id_libro JOIN Amigos a ON a.id_amigo_usuario = u.id_usuario WHERE a.id_usuario = ?';
            const [result] = await db.execute(query, [id_amigo]);
            return result;
        } catch (error) {
            throw new Error('Error al buscar resenias por id amigo: ' + error.message);
        }
    },

}


module.exports = amigos;